import { NextResponse } from 'next/server';
import { resolveLocale, type Locale } from '@/lib/i18n';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const OPENAI_MODEL = 'gpt-4.1-mini';
const MAX_TEXTS = 180;
const MAX_BATCH_SIZE = 40;
const MAX_TEXT_LENGTH = 1200;

type TranslationPayload = {
    target: 'en' | 'fr';
    texts: string[];
};

type CacheEntry = {
    translated: string;
    updatedAt: number;
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const translationCache = new Map<string, CacheEntry>();

function cacheKey(locale: Locale, text: string) {
    return `${locale}::${text}`;
}

function getCached(locale: Locale, text: string): string | null {
    const entry = translationCache.get(cacheKey(locale, text));
    if (!entry) return null;
    if (Date.now() - entry.updatedAt > CACHE_TTL_MS) {
        translationCache.delete(cacheKey(locale, text));
        return null;
    }
    return entry.translated;
}

function setCached(locale: Locale, text: string, translated: string) {
    translationCache.set(cacheKey(locale, text), { translated, updatedAt: Date.now() });
}

function isProbablyTranslatable(value: string): boolean {
    const text = value.trim();
    if (!text) return false;
    if (text.length < 2 || text.length > MAX_TEXT_LENGTH) return false;
    if (/^https?:\/\//i.test(text) || /^www\./i.test(text)) return false;
    if (/^#[0-9a-f]{3,8}$/i.test(text)) return false;
    if (/^[\d\s\W_]+$/.test(text)) return false;
    return true;
}

function extractResponseText(payload: any): string {
    if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
        return payload.output_text.trim();
    }

    if (Array.isArray(payload?.output)) {
        const chunks: string[] = [];
        for (const item of payload.output) {
            if (item?.type !== 'message' || !Array.isArray(item.content)) continue;
            for (const part of item.content) {
                if (part?.type === 'output_text' && typeof part.text === 'string') {
                    chunks.push(part.text);
                }
            }
        }
        const joined = chunks.join('\n').trim();
        if (joined) return joined;
    }

    return '';
}

function safeJsonParse<T>(value: string): T | null {
    try {
        return JSON.parse(value) as T;
    } catch (_error) {
        return null;
    }
}

function chunkArray<T>(values: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let idx = 0; idx < values.length; idx += size) {
        chunks.push(values.slice(idx, idx + size));
    }
    return chunks;
}

function parseTranslations(text: string): string[] | null {
    const parseObject = (candidate: string): string[] | null => {
        const parsed = safeJsonParse<{ translations?: unknown }>(candidate);
        if (!parsed || !Array.isArray(parsed.translations)) return null;
        const values = parsed.translations.map((item) => (typeof item === 'string' ? item : ''));
        return values;
    };

    const direct = parseObject(text);
    if (direct) return direct;

    const objStart = text.indexOf('{');
    const objEnd = text.lastIndexOf('}');
    if (objStart >= 0 && objEnd > objStart) {
        const objectCandidate = text.slice(objStart, objEnd + 1);
        const objectResult = parseObject(objectCandidate);
        if (objectResult) return objectResult;
    }

    const arrStart = text.indexOf('[');
    const arrEnd = text.lastIndexOf(']');
    if (arrStart >= 0 && arrEnd > arrStart) {
        const arrayCandidate = text.slice(arrStart, arrEnd + 1);
        const wrapped = `{"translations":${arrayCandidate}}`;
        const arrayResult = parseObject(wrapped);
        if (arrayResult) return arrayResult;
    }

    return null;
}

async function translateBatch(apiKey: string, payload: TranslationPayload): Promise<string[] | null> {
    const systemPrompt = [
        'You are a translation engine.',
        payload.target === 'en'
            ? 'Translate every input text into fluent, natural English.'
            : 'Traduis chaque texte en français fluide et naturel.',
        'Avoid literal, robotic wording.',
        'Keep meaning, punctuation, dates and numbers.',
        'Keep markdown, HTML tags, and line breaks structure.',
        'Do not add commentary.',
        'Return strict JSON only with this exact schema: {"translations": ["..."]}.',
        'The number of translations must match the number of input texts and preserve order.',
    ].join(' ');

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            input: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: JSON.stringify({ texts: payload.texts }),
                },
            ],
            temperature: 0.1,
            max_output_tokens: 2800,
        }),
    });

    if (!response.ok) return null;

    const raw = await response.json().catch(() => null);
    const text = extractResponseText(raw);
    if (!text) return null;

    const values = parseTranslations(text);
    if (!values) return null;
    if (values.length !== payload.texts.length) return null;

    return values;
}

export async function POST(req: Request) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'OPENAI_API_KEY is not configured.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const locale = resolveLocale(typeof body?.locale === 'string' ? body.locale : null);

        if (locale === 'es') {
            const raw: unknown[] = Array.isArray(body?.texts) ? body.texts : [];
            const items = raw
                .filter((item: unknown): item is string => typeof item === 'string')
                .map((source: string) => ({ source, target: source }));
            return NextResponse.json({ translations: items });
        }

        const target = locale as 'en' | 'fr';
        const input: unknown[] = Array.isArray(body?.texts) ? body.texts : [];
        const uniqueTexts = Array.from(
            new Set(
                input
                    .filter((item: unknown): item is string => typeof item === 'string')
                    .map((item: string) => item.trim())
                    .filter(isProbablyTranslatable)
                    .slice(0, MAX_TEXTS)
            )
        );

        if (uniqueTexts.length === 0) {
            return NextResponse.json({ translations: [] });
        }

        const unknownTexts: string[] = [];
        const translations = new Map<string, string>();

        for (const text of uniqueTexts) {
            const cached = getCached(locale, text);
            if (cached !== null) {
                translations.set(text, cached);
            } else {
                unknownTexts.push(text);
            }
        }

        if (unknownTexts.length > 0) {
            const batches = chunkArray(unknownTexts, MAX_BATCH_SIZE);
            const batchResults = await Promise.all(
                batches.map(async (texts) => ({
                    texts,
                    translated: await translateBatch(apiKey, { target, texts }),
                }))
            );

            batchResults.forEach(({ texts, translated }) => {
                if (!translated) {
                    texts.forEach((original) => translations.set(original, original));
                    return;
                }

                texts.forEach((original, idx) => {
                    const value = (translated[idx] || original).trim() || original;
                    translations.set(original, value);
                    if (value !== original) {
                        setCached(locale, original, value);
                    }
                });
            });
        }

        return NextResponse.json({
            translations: uniqueTexts.map((text) => ({
                source: text,
                target: translations.get(text) || text,
            })),
        });
    } catch (_error) {
        return NextResponse.json({ error: 'Translation service error.' }, { status: 500 });
    }
}

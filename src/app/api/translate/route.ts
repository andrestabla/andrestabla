import { NextResponse } from 'next/server';
import { resolveLocale, type Locale } from '@/lib/i18n';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-2.5-flash';
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

function extractGeminiText(payload: any): string {
    if (!payload || !Array.isArray(payload.candidates) || payload.candidates.length === 0) {
        return '';
    }

    const parts = payload.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return '';

    const text = parts
        .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
        .join('\n')
        .trim();

    return text;
}

async function translateBatch(apiKey: string, payload: TranslationPayload): Promise<string[] | null> {
    const systemPrompt = [
        'You are a professional translation engine.',
        payload.target === 'en'
            ? 'Translate every input text into fluent, natural, idiomatic English.'
            : 'Traduis chaque texte en français fluide, naturel et idiomatique.',
        'Prefer meaning-equivalent phrasing over literal wording.',
        'Keep punctuation, dates, numbers, acronyms, and terminology.',
        'Keep markdown, HTML tags, and line-break structure exactly when present.',
        'Do not add commentary.',
        'Return strict JSON only with this exact schema: {"translations": ["..."]}.',
        'The number of translations must match the number of input texts and preserve order.',
    ].join(' ');

    const response = await fetch(`${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: systemPrompt }],
            },
            contents: [
                {
                    role: 'user',
                    parts: [{ text: JSON.stringify({ texts: payload.texts }) }],
                },
            ],
            generationConfig: {
                temperature: 0.15,
                responseMimeType: 'application/json',
            },
        }),
    });

    if (!response.ok) return null;

    const raw = await response.json().catch(() => null);
    const text = extractGeminiText(raw);
    if (!text) return null;

    const values = parseTranslations(text);
    if (!values) return null;
    if (values.length !== payload.texts.length) return null;

    return values;
}

export async function POST(req: Request) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
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
                    .map((item: string) => item)
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

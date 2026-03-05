import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics';
import { prisma } from '@/lib/prisma';
import {
    ANDRES_ASSISTANT_KNOWLEDGE,
    CONTACT_BOOKING_URL,
    CONTACT_EMAIL,
    CONTACT_WHATSAPP_URL,
    LINKEDIN_URL,
} from '@/lib/assistantKnowledge';
import { CONSENT_POLICY_VERSION } from '@/lib/consent';
import { resolveLocale, t, type Locale } from '@/lib/i18n';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const OPENAI_MODEL = 'gpt-4.1-nano';
const MAX_CONTEXT_CHARS = 5000;
const MAX_MESSAGE_CHARS = 1200;
const MAX_HISTORY_MESSAGES = 8;
const CONTEXT_CACHE_TTL_MS = 5 * 60 * 1000;
const ANDRES_BIRTHDATE = { year: 1988, month: 5, day: 30 } as const;

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

type ChatAction = {
    label: string;
    url: string;
};

type SiteContextCache = {
    siteTitle: string;
    siteDescription: string;
    blocksSummary: string;
    cachedAt: number;
};

let siteContextCache: SiteContextCache | null = null;

const API_ERRORS: Record<Locale, Record<'missingApiKey' | 'noMessages' | 'openaiError' | 'noAssistantResponse' | 'internal', string>> = {
    es: {
        missingApiKey: 'OPENAI_API_KEY no configurada en el servidor.',
        noMessages: 'No hay mensajes para procesar.',
        openaiError: 'Error llamando a OpenAI.',
        noAssistantResponse: 'No se obtuvo respuesta del asistente.',
        internal: 'Error interno del servidor en el asistente.',
    },
    en: {
        missingApiKey: 'OPENAI_API_KEY is not configured on the server.',
        noMessages: 'No messages to process.',
        openaiError: 'Error calling OpenAI.',
        noAssistantResponse: 'No assistant response was returned.',
        internal: 'Internal server error in the assistant.',
    },
    fr: {
        missingApiKey: 'OPENAI_API_KEY n’est pas configurée sur le serveur.',
        noMessages: 'Aucun message à traiter.',
        openaiError: "Erreur lors de l'appel à OpenAI.",
        noAssistantResponse: "Aucune réponse de l'assistant n'a été reçue.",
        internal: "Erreur interne du serveur dans l'assistant.",
    },
};

function cleanText(value: string): string {
    return value
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getAndresCurrentAge(referenceDate = new Date()): number {
    const currentYear = referenceDate.getUTCFullYear();
    const currentMonth = referenceDate.getUTCMonth() + 1;
    const currentDay = referenceDate.getUTCDate();

    let age = currentYear - ANDRES_BIRTHDATE.year;
    const hasBirthdayPassedThisYear =
        currentMonth > ANDRES_BIRTHDATE.month ||
        (currentMonth === ANDRES_BIRTHDATE.month && currentDay >= ANDRES_BIRTHDATE.day);

    if (!hasBirthdayPassedThisYear) {
        age -= 1;
    }

    return age;
}

function normalizeForIntent(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function isAgeQuestion(value: string): boolean {
    const text = normalizeForIntent(value);
    return /\b(que edad|cuantos anos|anos tiene|edad tiene|edad de andres|how old|old is andres|quel age|age)\b/.test(text);
}

function isContactQuestion(value: string): boolean {
    const text = normalizeForIntent(value);
    return /\b(contacto|contactar|correo|email|e-mail|mail|whatsapp|agendar|reunion|reunirse|escribir|contact|schedule|book|meeting|rendezvous)\b/.test(text);
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function messageContainsContactDetails(value: string): boolean {
    const normalized = normalizeForIntent(value);
    return (
        normalized.includes(normalizeForIntent(CONTACT_EMAIL)) ||
        normalized.includes(normalizeForIntent(CONTACT_BOOKING_URL)) ||
        normalized.includes(normalizeForIntent(CONTACT_WHATSAPP_URL)) ||
        /\b(contacto|contactar|agendar|whatsapp|correo|email|mail|reunion|contact|schedule|book|meeting|rendezvous)\b/.test(normalized)
    );
}

function buildContactMessage(locale: Locale): string {
    return t(locale, 'assistantApi.contactHint');
}

function buildContactActions(locale: Locale): ChatAction[] {
    return [
        { label: `${t(locale, 'assistantApi.actionEmail')}: ${CONTACT_EMAIL}`, url: `mailto:${CONTACT_EMAIL}` },
        { label: t(locale, 'assistantApi.actionBooking'), url: CONTACT_BOOKING_URL },
        { label: t(locale, 'assistantApi.actionWhatsapp'), url: CONTACT_WHATSAPP_URL },
    ];
}

function sanitizeContactMessageForCta(message: string): string {
    const withoutLinks = message
        .replace(new RegExp(escapeRegExp(CONTACT_BOOKING_URL), 'gi'), '')
        .replace(new RegExp(escapeRegExp(CONTACT_WHATSAPP_URL), 'gi'), '')
        .replace(new RegExp(escapeRegExp(CONTACT_EMAIL), 'gi'), '')
        .replace(/https?:\/\/\S+/gi, '')
        .replace(/\[\s*(enlace|link|lien)\s*\]/gi, '')
        .replace(/\(\s*\)/g, '');

    const lines = withoutLinks
        .split('\n')
        .map((line) => line.trim().replace(/\s{2,}/g, ' '))
        .filter(Boolean)
        .filter((line) => {
            const normalized = normalizeForIntent(line);
            const looksLikeRedundantContactLine =
                /^(\d+[\.\)]|-|•)\s*/.test(line) &&
                /\b(correo|email|agendar|reunion|whatsapp|contacto|contact|meeting|book|schedule|rendezvous)\b/.test(normalized);
            return !looksLikeRedundantContactLine;
        });

    return lines.join('\n').trim();
}

function inferLocaleFromAcceptLanguage(value: string | null): Locale {
    if (!value) return resolveLocale(null);
    const parts = value.split(',');
    for (const part of parts) {
        const token = part.trim().split(';')[0];
        if (!token) continue;
        const code = token.split('-')[0];
        const resolved = resolveLocale(code);
        if (resolved !== 'es' || code.toLowerCase().startsWith('es')) {
            return resolved;
        }
    }
    return resolveLocale(null);
}

function resolveRequestLocale(req: Request, body: any): Locale {
    if (typeof body?.locale === 'string') {
        return resolveLocale(body.locale);
    }
    const localeHeader = req.headers.get('x-locale');
    if (localeHeader) {
        return resolveLocale(localeHeader);
    }
    return inferLocaleFromAcceptLanguage(req.headers.get('accept-language'));
}

function resolveRequestLocaleFromHeaders(req: Request): Locale {
    const localeHeader = req.headers.get('x-locale');
    if (localeHeader) {
        return resolveLocale(localeHeader);
    }
    return inferLocaleFromAcceptLanguage(req.headers.get('accept-language'));
}

function getLanguageInstruction(locale: Locale): string {
    if (locale === 'en') return 'CRITICAL: Respond ONLY in English. Do not respond in Spanish.';
    if (locale === 'fr') return 'CRITIQUE: Réponds UNIQUEMENT en français. Ne réponds pas en espagnol.';
    return 'Responde SIEMPRE en español.';
}

function isLikelyUrl(value: string): boolean {
    return /^https?:\/\//i.test(value) || value.includes('images.unsplash.com');
}

function collectStrings(input: unknown, out: string[]) {
    if (typeof input === 'string') {
        const cleaned = cleanText(input);
        if (cleaned.length >= 3 && cleaned.length <= 240 && !isLikelyUrl(cleaned)) {
            out.push(cleaned);
        }
        return;
    }
    if (Array.isArray(input)) {
        for (const item of input) collectStrings(item, out);
        return;
    }
    if (input && typeof input === 'object') {
        for (const value of Object.values(input as Record<string, unknown>)) {
            collectStrings(value, out);
        }
    }
}

function summarizeBlocks(blocks: any[]): string {
    const lines: string[] = [];

    for (const block of blocks) {
        try {
            const parsed = JSON.parse(block.data || '{}');
            const values: string[] = [];
            collectStrings(parsed, values);
            const unique = Array.from(new Set(values)).slice(0, 6);
            if (unique.length === 0) continue;
            lines.push(`${String(block.type || 'block').toUpperCase()}: ${unique.join(' | ')}`);
        } catch (_error) {
            // ignore malformed block data
        }
    }

    const summary = lines.join('\n');
    if (summary.length <= MAX_CONTEXT_CHARS) return summary;
    return summary.slice(0, MAX_CONTEXT_CHARS);
}

async function getSiteContext() {
    const now = Date.now();
    if (siteContextCache && now - siteContextCache.cachedAt < CONTEXT_CACHE_TTL_MS) {
        return {
            siteTitle: siteContextCache.siteTitle,
            siteDescription: siteContextCache.siteDescription,
            blocksSummary: siteContextCache.blocksSummary,
        };
    }

    try {
        const [siteSettings, homePage] = await Promise.all([
            prisma.siteSettings.findUnique({ where: { id: 'global' } }),
            prisma.page.findUnique({
                where: { slug: 'home' },
                include: { blocks: { orderBy: { order: 'asc' } } },
            }),
        ]);

        const blocksSummary = homePage?.blocks ? summarizeBlocks(homePage.blocks) : '';
        const siteTitle = siteSettings?.title || 'Andrés Tabla Rico';
        const siteDescription = siteSettings?.description || '';

        siteContextCache = {
            siteTitle,
            siteDescription,
            blocksSummary,
            cachedAt: now,
        };

        return { siteTitle, siteDescription, blocksSummary };
    } catch (error) {
        if (siteContextCache) {
            return {
                siteTitle: siteContextCache.siteTitle,
                siteDescription: siteContextCache.siteDescription,
                blocksSummary: siteContextCache.blocksSummary,
            };
        }
        throw error;
    }
}

function extractResponseText(payload: any): string {
    if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
        return payload.output_text.trim();
    }

    if (Array.isArray(payload?.output)) {
        const parts: string[] = [];
        for (const item of payload.output) {
            if (item?.type === 'message' && Array.isArray(item.content)) {
                for (const part of item.content) {
                    if (part?.type === 'output_text' && typeof part.text === 'string') {
                        parts.push(part.text);
                    }
                }
            }
        }
        const joined = parts.join('\n').trim();
        if (joined) return joined;
    }

    return '';
}

export async function POST(req: Request) {
    const requestLocale = resolveRequestLocaleFromHeaders(req);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: API_ERRORS[requestLocale].missingApiKey },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const locale = resolveRequestLocale(req, body);
        const rawMessages = Array.isArray(body?.messages) ? body.messages : [];

        const messages: ChatMessage[] = rawMessages
            .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
            .map((m: any) => ({
                role: m.role,
                content: String(m.content).slice(0, MAX_MESSAGE_CHARS),
            }))
            .slice(-MAX_HISTORY_MESSAGES);

        if (messages.length === 0) {
            return NextResponse.json({ error: API_ERRORS[locale].noMessages }, { status: 400 });
        }

        const latestUserMessage =
            [...messages]
                .reverse()
                .find((message) => message.role === 'user')
                ?.content || '';

        const consentState = req.headers.get('x-consent-state') === 'accepted' ? 'accepted' : 'declined';
        const consentVersion =
            (req.headers.get('x-consent-version') || '').trim().slice(0, 16) || CONSENT_POLICY_VERSION;
        const pagePath = typeof body?.path === 'string' ? body.path : '';

        if (latestUserMessage) {
            try {
                await recordAnalyticsEvent({
                    request: req,
                    eventType: 'assistant_question',
                    consentState,
                    policyVersion: consentVersion,
                    pagePath,
                    question: latestUserMessage,
                });
            } catch (_analyticsError) {
                // Ignore analytics failures to keep the assistant responsive.
            }
        }

        if (latestUserMessage) {
            const asksAge = isAgeQuestion(latestUserMessage);
            const asksContact = isContactQuestion(latestUserMessage);

            if (asksAge || asksContact) {
                const directParts: string[] = [];
                if (asksAge) {
                    directParts.push(t(locale, 'assistantApi.ageSentence', { age: getAndresCurrentAge() }));
                }
                if (asksContact) {
                    directParts.push(buildContactMessage(locale));
                }
                return NextResponse.json({
                    message: directParts.join('\n\n'),
                    actions: asksContact ? buildContactActions(locale) : undefined,
                });
            }
        }
        const { siteTitle, siteDescription, blocksSummary } = await getSiteContext();
        const andresAge = getAndresCurrentAge();

        const systemPrompt = [
            'Eres el asistente oficial del portafolio de Andrés Tabla Rico.',
            getLanguageInstruction(locale),
            'Mantén tono profesional, claro y útil.',
            'Tu objetivo es ayudar a visitantes a conocer su perfil, experiencia, formación, cursos y servicios.',
            'Usa únicamente la información de contexto entregada; no inventes datos.',
            'Si te preguntan algo no disponible en el contexto, dilo explícitamente y sugiere contactar a Andrés con las 3 opciones oficiales de contacto.',
            'Si preguntan la edad de Andrés, responde solo con su edad actual en años. Nunca reveles su fecha de nacimiento.',
            `Edad actual de Andrés (referencia interna): ${andresAge} años.`,
            'Cuando te pidan LinkedIn, comparte exactamente esta URL:',
            LINKEDIN_URL,
            'Cuando te pidan contacto, cómo escribirle, cómo agendar o cómo hablar con Andrés, entrega exactamente estas 3 opciones numeradas:',
            `1. Correo: ${CONTACT_EMAIL}`,
            `2. Agendar reunión: ${CONTACT_BOOKING_URL}`,
            `3. WhatsApp: ${CONTACT_WHATSAPP_URL}`,
            '',
            'Contexto base de conocimiento (hoja de vida y trayectoria):',
            ANDRES_ASSISTANT_KNOWLEDGE,
            '',
            `Contexto del sitio: ${siteTitle}.`,
            siteDescription ? `Descripción: ${siteDescription}` : '',
            blocksSummary ? `Contenido detectado en la web:\n${blocksSummary}` : '',
        ]
            .filter(Boolean)
            .join('\n');

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
                    ...messages.map((m) => ({ role: m.role, content: m.content })),
                ],
                max_output_tokens: 300,
                temperature: 0.3,
            }),
        });

        if (!response.ok) {
            const errorPayload = await response.json().catch(() => null);
            const errorMessage = errorPayload?.error?.message || API_ERRORS[locale].openaiError;
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

        const payload = await response.json();
        const message = extractResponseText(payload);

        if (!message) {
            return NextResponse.json(
                { error: API_ERRORS[locale].noAssistantResponse },
                { status: 500 }
            );
        }

        const attachContactActions =
            isContactQuestion(latestUserMessage) || messageContainsContactDetails(message);

        const sanitizedMessage = attachContactActions
            ? sanitizeContactMessageForCta(message)
            : message;

        const finalMessage = attachContactActions
            ? [
                sanitizedMessage,
                t(locale, 'assistantApi.ctaHint'),
            ]
                .filter(Boolean)
                .join('\n\n')
            : message;

        return NextResponse.json({
            message: finalMessage,
            actions: attachContactActions ? buildContactActions(locale) : undefined,
        });
    } catch (_error) {
        return NextResponse.json(
            { error: API_ERRORS[requestLocale].internal },
            { status: 500 }
        );
    }
}

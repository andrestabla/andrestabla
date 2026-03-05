import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const MAX_CONTEXT_CHARS = 8000;

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

function cleanText(value: string): string {
    return value
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: 'OPENAI_API_KEY no configurada en el servidor.' },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const rawMessages = Array.isArray(body?.messages) ? body.messages : [];

        const messages: ChatMessage[] = rawMessages
            .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
            .map((m: any) => ({
                role: m.role,
                content: String(m.content).slice(0, 2500),
            }))
            .slice(-12);

        if (messages.length === 0) {
            return NextResponse.json({ error: 'No hay mensajes para procesar.' }, { status: 400 });
        }

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

        const systemPrompt = [
            'Eres el asistente oficial del portafolio de Andrés Tabla Rico.',
            'Responde SIEMPRE en español, con tono profesional, claro y útil.',
            'Tu objetivo es ayudar a visitantes a conocer su perfil, experiencia, formación, cursos y servicios.',
            'Usa únicamente la información de contexto entregada; no inventes datos.',
            'Si te preguntan algo no disponible en el contexto, dilo explícitamente y sugiere contactar a Andrés.',
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
                max_output_tokens: 500,
                temperature: 0.5,
            }),
        });

        if (!response.ok) {
            const errorPayload = await response.json().catch(() => null);
            const errorMessage = errorPayload?.error?.message || 'Error llamando a OpenAI.';
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

        const payload = await response.json();
        const message = extractResponseText(payload);

        if (!message) {
            return NextResponse.json(
                { error: 'No se obtuvo respuesta del asistente.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ message });
    } catch (_error) {
        return NextResponse.json(
            { error: 'Error interno del servidor en el asistente.' },
            { status: 500 }
        );
    }
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.andrestabla.com').replace(/\/+$/, '');
export const SITE_NAME = 'Andrés Tabla Rico';
export const DEFAULT_SEO_TITLE = 'Andrés Tabla Rico | Educación, Innovación Digital e IA';
export const DEFAULT_SEO_DESCRIPTION =
    'Portafolio oficial de Andrés Tabla Rico: educación, transformación digital, IA aplicada y proyectos TIC para instituciones en LATAM.';

export function absoluteUrl(pathOrUrl: string): string {
    const value = String(pathOrUrl || '').trim();
    if (!value) return SITE_URL;
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith('/')) return `${SITE_URL}${value}`;
    return `${SITE_URL}/${value}`;
}

export function stripHtml(value: string): string {
    return String(value || '')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

export function truncate(value: string, max = 180): string {
    const text = String(value || '').trim();
    if (text.length <= max) return text;
    return `${text.slice(0, Math.max(0, max - 1)).trim()}...`;
}

export function extractFirstImageFromBlocks(blocks: Array<{ type: string; data: string }>): string {
    for (const block of blocks) {
        if (block.type !== 'image') continue;
        try {
            const parsed = JSON.parse(block.data || '{}');
            const raw = String(parsed?.url || '').trim();
            if (raw) return raw;
        } catch {
            // Ignore invalid block JSON
        }
    }
    return '';
}

export function extractFirstRichTextExcerptFromBlocks(
    blocks: Array<{ type: string; data: string }>,
    max = 180
): string {
    for (const block of blocks) {
        if (block.type !== 'richtext') continue;
        try {
            const parsed = JSON.parse(block.data || '{}');
            const source =
                typeof parsed?.content === 'string'
                    ? parsed.content
                    : typeof parsed?.text === 'string'
                        ? parsed.text
                        : '';
            const clean = truncate(stripHtml(source), max);
            if (clean) return clean;
        } catch {
            // Ignore invalid block JSON
        }
    }
    return '';
}

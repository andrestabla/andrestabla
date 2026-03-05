const ARTICLE_PAGE_PREFIX = 'article-';

export function normalizeSlugPart(value: string, fallback = 'articulo'): string {
    const normalized = (value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 70);

    return normalized || fallback;
}

export function buildArticlePageSlug(articleSlugPart: string): string {
    return `${ARTICLE_PAGE_PREFIX}${normalizeSlugPart(articleSlugPart)}`;
}

export function isArticlePageSlug(pageSlug: string): boolean {
    return String(pageSlug || '').startsWith(ARTICLE_PAGE_PREFIX);
}

export function extractArticleSlugPart(pageSlug: string): string {
    if (!isArticlePageSlug(pageSlug)) return normalizeSlugPart(pageSlug);
    const raw = pageSlug.slice(ARTICLE_PAGE_PREFIX.length);
    return normalizeSlugPart(raw);
}

export function buildArticlePublicPath(articleSlugPart: string): string {
    return `/articulos/${normalizeSlugPart(articleSlugPart)}`;
}

export function buildAdminEditPath(pageSlug: string): string {
    return `/admin?slug=${encodeURIComponent(pageSlug)}`;
}

export function humanizeSlug(value: string): string {
    const source = normalizeSlugPart(value).replace(/-/g, ' ').trim();
    if (!source) return 'Artículo';
    return source.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

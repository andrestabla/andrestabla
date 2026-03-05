import { prisma } from '@/lib/prisma';
import {
    buildArticlePageSlug,
    buildArticlePublicPath,
    extractArticleSlugPart,
    normalizeSlugPart,
} from '@/lib/articlePages';

export type BlogCatalogItem = {
    title: string;
    category: string;
    date: string;
    excerpt: string;
    image: string;
    href: string;
    articleSlug: string;
    publishedAt: Date;
};

type RawLoopItem = {
    title: string;
    category: string;
    date: string;
    excerpt: string;
    image: string;
    href: string;
    articleSlug: string;
};

const MONTH_INDEX: Record<string, number> = {
    jan: 1,
    january: 1,
    ene: 1,
    enero: 1,
    janvier: 1,
    feb: 2,
    february: 2,
    febrero: 2,
    fev: 2,
    fevrier: 2,
    mar: 3,
    march: 3,
    marzo: 3,
    mars: 3,
    apr: 4,
    april: 4,
    abr: 4,
    abril: 4,
    avr: 4,
    avril: 4,
    may: 5,
    mayo: 5,
    mai: 5,
    jun: 6,
    june: 6,
    junio: 6,
    juin: 6,
    jul: 7,
    july: 7,
    julio: 7,
    juil: 7,
    juillet: 7,
    aug: 8,
    august: 8,
    ago: 8,
    agosto: 8,
    aou: 8,
    aout: 8,
    sep: 9,
    sept: 9,
    september: 9,
    septiembre: 9,
    septembre: 9,
    oct: 10,
    october: 10,
    octubre: 10,
    octobre: 10,
    nov: 11,
    november: 11,
    noviembre: 11,
    novembre: 11,
    dec: 12,
    dic: 12,
    december: 12,
    diciembre: 12,
    decembre: 12,
};

function parsePositiveInteger(value: string): number | null {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseMonthToken(value: string): number | null {
    const normalized = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\./g, '')
        .trim();

    return MONTH_INDEX[normalized] || null;
}

function buildDateUtc(year: number, month: number, day = 1): Date | null {
    if (!Number.isFinite(year) || year < 1900 || year > 2200) return null;
    if (!Number.isFinite(month) || month < 1 || month > 12) return null;
    if (!Number.isFinite(day) || day < 1 || day > 31) return null;

    const date = new Date(Date.UTC(year, month - 1, day));
    return Number.isNaN(date.getTime()) ? null : date;
}

export function parseArticleDisplayDate(input: string): Date | null {
    const raw = String(input || '').trim();
    if (!raw) return null;

    const nativeDate = new Date(raw);
    if (!Number.isNaN(nativeDate.getTime())) {
        return nativeDate;
    }

    if (/^\d{4}$/.test(raw)) {
        return buildDateUtc(Number.parseInt(raw, 10), 1, 1);
    }

    const isoMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (isoMatch) {
        return buildDateUtc(Number.parseInt(isoMatch[1], 10), Number.parseInt(isoMatch[2], 10), Number.parseInt(isoMatch[3], 10));
    }

    const compact = raw
        .replace(/,/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const parts = compact.split(' ');
    if (parts.length >= 3) {
        const firstMonth = parseMonthToken(parts[0]);
        const secondMonth = parseMonthToken(parts[1]);

        if (firstMonth) {
            const day = parsePositiveInteger(parts[1]) || 1;
            const year = parsePositiveInteger(parts[2]) || 0;
            const date = buildDateUtc(year, firstMonth, day);
            if (date) return date;
        }

        if (secondMonth) {
            const day = parsePositiveInteger(parts[0]) || 1;
            const year = parsePositiveInteger(parts[2]) || 0;
            const date = buildDateUtc(year, secondMonth, day);
            if (date) return date;
        }
    }

    return null;
}

export function formatBlogDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'America/Bogota',
    }).format(date);
}

function extractSlugFromHref(href: string): string {
    const value = String(href || '').trim();
    if (!value) return '';

    const directMatch = value.match(/\/articulos\/([^/?#]+)/i);
    if (directMatch?.[1]) return normalizeSlugPart(directMatch[1]);

    return '';
}

function coerceRawLoopItem(item: unknown): RawLoopItem | null {
    if (!item || typeof item !== 'object') return null;

    const raw = item as Record<string, unknown>;
    const title = String(raw.title || '').trim();
    const category = String(raw.category || '').trim();
    const date = String(raw.date || '').trim();
    const excerpt = String(raw.excerpt || '').trim();
    const image = String(raw.image || '').trim();
    const href = String(raw.href || '').trim();
    const articleSlug = normalizeSlugPart(
        String(raw.articleSlug || '').trim() || extractSlugFromHref(href),
        ''
    );

    if (!title && !excerpt && !href && !articleSlug) {
        return null;
    }

    return {
        title,
        category,
        date,
        excerpt,
        image,
        href,
        articleSlug,
    };
}

export async function getPublishedBlogItems(): Promise<BlogCatalogItem[]> {
    const loopgridBlocks = await prisma.block.findMany({
        where: { type: 'loopgrid' },
        select: { data: true },
    });

    const rawItems: RawLoopItem[] = [];

    for (const loopgrid of loopgridBlocks) {
        let parsed: any = null;
        try {
            parsed = JSON.parse(loopgrid.data || '{}');
        } catch (_error) {
            parsed = null;
        }

        if (!parsed || String(parsed.postType || 'blog') !== 'blog') continue;

        const sourceItems = Array.isArray(parsed.items) ? parsed.items : [];
        for (const sourceItem of sourceItems) {
            const rawItem = coerceRawLoopItem(sourceItem);
            if (!rawItem) continue;
            rawItems.push(rawItem);
        }
    }

    if (rawItems.length === 0) {
        return [];
    }

    const uniqueByKey = new Map<string, RawLoopItem>();
    for (const item of rawItems) {
        const key = item.articleSlug || item.href || `${item.title}::${item.date}`;
        if (!uniqueByKey.has(key)) {
            uniqueByKey.set(key, item);
        }
    }

    const uniqueItems = Array.from(uniqueByKey.values());

    const articleSlugs = uniqueItems
        .map((item) => item.articleSlug)
        .filter(Boolean);

    const pages = articleSlugs.length
        ? await prisma.page.findMany({
            where: {
                slug: {
                    in: articleSlugs.map((slug) => buildArticlePageSlug(slug)),
                },
            },
            select: {
                slug: true,
                title: true,
                description: true,
                createdAt: true,
            },
        })
        : [];

    const pageByArticleSlug = new Map<string, { title: string; description: string; createdAt: Date }>();
    for (const page of pages) {
        pageByArticleSlug.set(extractArticleSlugPart(page.slug), {
            title: page.title,
            description: page.description || '',
            createdAt: page.createdAt,
        });
    }

    const result: BlogCatalogItem[] = uniqueItems
        .map((item) => {
            const pageMeta = item.articleSlug ? pageByArticleSlug.get(item.articleSlug) : undefined;
            const parsedDate = parseArticleDisplayDate(item.date);
            const publishedAt = parsedDate || pageMeta?.createdAt || new Date(0);
            const date = item.date || (pageMeta?.createdAt ? formatBlogDate(pageMeta.createdAt) : '');
            const title = item.title || pageMeta?.title || 'Artículo';
            const excerpt = item.excerpt || pageMeta?.description || '';
            const category = item.category || 'General';
            const href = item.articleSlug
                ? buildArticlePublicPath(item.articleSlug)
                : item.href || '#';

            return {
                title,
                category,
                date,
                excerpt,
                image: item.image,
                href,
                articleSlug: item.articleSlug,
                publishedAt,
            };
        })
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    return result;
}

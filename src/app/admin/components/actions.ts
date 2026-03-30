'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
    extractArticleSlugPart,
    buildAdminEditPath,
    buildArticlePageSlug,
    buildArticlePublicPath,
    humanizeSlug,
    isArticlePageSlug,
    normalizeSlugPart,
} from '@/lib/articlePages';

function revalidateSharedRoutes() {
    revalidatePath('/');
    revalidatePath('/articulos');
    revalidatePath('/admin');
}

async function revalidateRoutesForPageSlug(pageSlug?: string | null) {
    revalidateSharedRoutes();

    if (!pageSlug) return;

    if (pageSlug === 'home') {
        revalidatePath('/');
        return;
    }

    if (isArticlePageSlug(pageSlug)) {
        const articleSlug = extractArticleSlugPart(pageSlug);
        revalidatePath(buildArticlePublicPath(articleSlug));
    }
}

async function revalidateRoutesForPage(pageId: string) {
    const pageRecord = await prisma.page.findUnique({
        where: { id: pageId },
        select: { slug: true },
    });

    await revalidateRoutesForPageSlug(pageRecord?.slug);
}

async function revalidateRoutesForBlock(blockId: string) {
    const blockRecord = await prisma.block.findUnique({
        where: { id: blockId },
        select: {
            page: {
                select: { slug: true },
            },
        },
    });

    await revalidateRoutesForPageSlug(blockRecord?.page?.slug);
}

// Update a single block's JSON data
export async function updateBlockData(id: string, newData: string) {
    const blockRecord = await prisma.block.findUnique({
        where: { id },
        select: { type: true },
    });
    const nextData = blockRecord?.type === 'loopgrid'
        ? await normalizeLoopgridBlockData(newData)
        : newData;

    await prisma.block.update({
        where: { id },
        data: { data: nextData }
    });
    await revalidateRoutesForBlock(id);
}

// Update a single block's styling overrides (backgrounds, paddings)
export async function updateBlockStyles(id: string, newStyles: string) {
    await prisma.block.update({
        where: { id },
        data: { styles: newStyles }
    });
    await revalidateRoutesForBlock(id);
}

export async function toggleBlockVisibility(id: string, nextHidden: boolean) {
    await prisma.block.update({
        where: { id },
        data: { isHidden: nextHidden },
    });
    await revalidateRoutesForBlock(id);
}

// Add a new block to the end of the page (or inside a parent)
export async function addBlock(pageId: string, type: string, defaultData: any, parentId?: string) {
    const count = await prisma.block.count({ where: { pageId, parentId: parentId || null } });

    await prisma.block.create({
        data: {
            pageId,
            parentId: parentId || null,
            type,
            data: JSON.stringify(defaultData),
            order: count + 1
        }
    });
    await revalidateRoutesForPage(pageId);
}

// Delete a block
export async function deleteBlock(id: string) {
    const blockRecord = await prisma.block.findUnique({
        where: { id },
        select: { pageId: true },
    });

    await prisma.block.delete({ where: { id } });

    if (blockRecord?.pageId) {
        await revalidateRoutesForPage(blockRecord.pageId);
        return;
    }

    revalidateSharedRoutes();
}

// Reorder blocks (drag and drop support)
export async function reorderBlocks(pageId: string, blockIds: string[]) {
    // blockIds is an array of IDs in the new correct order
    const updatePromises = blockIds.map((id, index) =>
        prisma.block.update({
            where: { id },
            data: { order: index }
        })
    );

    await prisma.$transaction(updatePromises);
    await revalidateRoutesForPage(pageId);
}

// Update Global Settings (SiteSettings)
export async function updateGlobalSettings(newStyles: string) {
    await prisma.siteSettings.upsert({
        where: { id: 'global' },
        update: { globalStyles: newStyles },
        create: {
            id: 'global',
            title: 'Mi Sitio',
            globalStyles: newStyles
        }
    });

    revalidatePath('/');
    revalidatePath('/admin');
}

type EnsureArticlePageInput = {
    articleSlug?: string;
    title?: string;
    excerpt?: string;
    image?: string;
};

export async function ensureArticlePage(input: EnsureArticlePageInput) {
    const slugSeed = normalizeSlugPart(input.articleSlug || input.title || 'articulo');
    const existingArticle = await resolveArticlePageByAlias(slugSeed);
    const articleSlug = existingArticle?.articleSlug || slugSeed;
    const pageSlug = buildArticlePageSlug(articleSlug);
    const pageTitle = (input.title || '').trim() || humanizeSlug(articleSlug);
    const pageDescription = (input.excerpt || '').trim();
    const coverImage = (input.image || '').trim();

    let page = existingArticle?.page || null;

    if (!page) {
        page = await prisma.page.create({
            data: {
                slug: pageSlug,
                title: pageTitle,
                description: pageDescription || null,
                isPublished: true,
            },
            include: { blocks: { orderBy: { order: 'asc' } } },
        });
    } else {
        await prisma.page.update({
            where: { id: page.id },
            data: {
                title: pageTitle || page.title,
                description: pageDescription || page.description || null,
            },
        });
    }

    const hasBlocks = page.blocks.length > 0;
    if (!hasBlocks) {
        const starterBlocks = [
            {
                type: 'heading',
                data: {
                    text: pageTitle,
                    tag: 'h1',
                    align: 'left',
                },
            },
            {
                type: 'image',
                data: {
                    url: coverImage,
                    alt: pageTitle,
                },
            },
            {
                type: 'richtext',
                data: {
                    title: 'Introducción',
                    content: pageDescription
                        ? `<p>${pageDescription}</p>`
                        : '<p>Escribe aquí el contenido principal del artículo.</p>',
                },
            },
            {
                type: 'video',
                data: {
                    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                },
            },
        ];

        await prisma.$transaction(
            starterBlocks.map((block, index) =>
                prisma.block.create({
                    data: {
                        pageId: page!.id,
                        type: block.type,
                        data: JSON.stringify(block.data),
                        order: index + 1,
                    },
                })
            )
        );
    }

    const publicPath = buildArticlePublicPath(articleSlug);
    const adminPath = buildAdminEditPath(pageSlug);

    revalidatePath('/');
    revalidatePath(publicPath);
    revalidatePath('/admin');

    return { articleSlug, pageSlug, publicPath, adminPath };
}

type ArticleMeta = {
    title: string;
    excerpt: string;
    image: string;
};

const MAX_EXCERPT_LENGTH = 180;

function parseJsonObject(raw: string): Record<string, any> {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed as Record<string, any>;
        return {};
    } catch {
        return {};
    }
}

function stripHtmlToText(value: string): string {
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

function truncateText(value: string, maxLength = MAX_EXCERPT_LENGTH): string {
    const text = String(value || '').trim();
    if (text.length <= maxLength) return text;
    return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}...`;
}

function extractArticleMeta(page: {
    title: string;
    description: string | null;
    blocks: Array<{ type: string; data: string }>;
}): ArticleMeta {
    let title = '';
    let excerpt = '';
    let image = '';

    const sortedBlocks = [...page.blocks];

    for (const block of sortedBlocks) {
        const data = parseJsonObject(block.data);

        if (!title && block.type === 'heading' && typeof data.text === 'string') {
            const normalizedTitle = stripHtmlToText(data.text);
            if (normalizedTitle) title = normalizedTitle;
        }

        if (!image && block.type === 'image' && typeof data.url === 'string') {
            const normalizedImage = String(data.url || '').trim();
            if (normalizedImage) image = normalizedImage;
        }

        if (!excerpt && block.type === 'richtext') {
            const candidate =
                typeof data.content === 'string'
                    ? data.content
                    : typeof data.text === 'string'
                        ? data.text
                        : '';
            const normalizedExcerpt = truncateText(stripHtmlToText(candidate));
            if (normalizedExcerpt) excerpt = normalizedExcerpt;
        }
    }

    const fallbackTitle = stripHtmlToText(page.title || '');
    const fallbackExcerpt = truncateText(stripHtmlToText(page.description || ''));

    return {
        title: title || fallbackTitle || 'Artículo',
        excerpt: excerpt || fallbackExcerpt,
        image,
    };
}

function extractSlugFromHref(href: string): string {
    const value = String(href || '').trim();
    if (!value) return '';

    const directMatch = value.match(/\/articulos\/([^/?#]+)/i);
    if (directMatch?.[1]) return normalizeSlugPart(directMatch[1]);

    return '';
}

function getLoopItemSlug(item: any): string {
    return normalizeSlugPart(
        String(item?.articleSlug || '').trim() || extractSlugFromHref(item?.href || ''),
        ''
    );
}

function resolveRedirectedSlug(slug: string, redirectMap: Map<string, string>): string {
    let current = normalizeSlugPart(slug, '');
    const visited = new Set<string>();

    while (current && redirectMap.has(current) && !visited.has(current)) {
        visited.add(current);
        current = normalizeSlugPart(redirectMap.get(current) || '', current);
    }

    return current;
}

function buildArticleRedirectMap(
    redirectRows: Array<{ fromSlug: string; toSlug: string }>,
    excludedFromSlug = ''
) {
    const redirectMap = new Map<string, string>();

    for (const row of redirectRows) {
        const fromSlug = normalizeSlugPart(row.fromSlug, '');
        const toSlug = normalizeSlugPart(row.toSlug, '');
        if (!fromSlug || !toSlug || fromSlug === excludedFromSlug || fromSlug === toSlug) continue;
        redirectMap.set(fromSlug, toSlug);
    }

    return redirectMap;
}

async function loadArticleRedirectMap(excludedFromSlug = '') {
    const redirectRows = await prisma.articleSlugRedirect.findMany({
        select: { fromSlug: true, toSlug: true },
    });

    return buildArticleRedirectMap(redirectRows, excludedFromSlug);
}

function normalizeLoopGridItem(item: any, redirectMap: Map<string, string>) {
    if (!item || typeof item !== 'object') return {};

    const nextItem = { ...item };
    const rawSlug = getLoopItemSlug(nextItem);
    const canonicalSlug = rawSlug ? resolveRedirectedSlug(rawSlug, redirectMap) : '';

    if (canonicalSlug) {
        nextItem.articleSlug = canonicalSlug;
        nextItem.href = buildArticlePublicPath(canonicalSlug);
    }

    return nextItem;
}

async function normalizeLoopgridBlockData(rawData: string): Promise<string> {
    let parsed: any = null;
    try {
        parsed = JSON.parse(rawData);
    } catch {
        return rawData;
    }

    if (!parsed || typeof parsed !== 'object') {
        return rawData;
    }

    if (String(parsed.postType || 'blog') !== 'blog') {
        return JSON.stringify(parsed);
    }

    const sourceItems = Array.isArray(parsed.items) ? parsed.items : [];
    const redirectMap = await loadArticleRedirectMap();
    const normalizedItems = sourceItems.map((item: any) => normalizeLoopGridItem(item, redirectMap));
    parsed.items = dedupeLoopItems(normalizedItems, redirectMap, '');

    return JSON.stringify(parsed);
}

function rankLoopItem(item: any, preferredSlug: string): number {
    const slug = getLoopItemSlug(item);
    let score = 0;

    if (slug && slug === preferredSlug) score += 8;
    if (String(item?.title || '').trim()) score += 4;
    if (String(item?.excerpt || '').trim()) score += 2;
    if (String(item?.image || '').trim()) score += 1;
    if (String(item?.href || '').trim()) score += 1;

    return score;
}

function dedupeLoopItems(items: any[], redirectMap: Map<string, string>, preferredSlug: string) {
    const deduped: any[] = [];
    const keyToIndex = new Map<string, number>();

    for (const sourceItem of items) {
        const item = sourceItem && typeof sourceItem === 'object'
            ? { ...sourceItem }
            : {};

        const rawSlug = getLoopItemSlug(item);
        const canonicalSlug = rawSlug
            ? resolveRedirectedSlug(rawSlug, redirectMap)
            : '';
        const fallbackKey = `${String(item.title || '').trim().toLowerCase()}::${String(item.date || '').trim().toLowerCase()}`;
        const dedupeKey = canonicalSlug || fallbackKey;

        if (!dedupeKey) {
            deduped.push(item);
            continue;
        }

        const existingIndex = keyToIndex.get(dedupeKey);
        if (existingIndex === undefined) {
            keyToIndex.set(dedupeKey, deduped.length);
            deduped.push(item);
            continue;
        }

        const existingItem = deduped[existingIndex];
        if (rankLoopItem(item, preferredSlug) > rankLoopItem(existingItem, preferredSlug)) {
            deduped[existingIndex] = item;
        }
    }

    return deduped;
}

function formatBlogDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'America/Bogota',
    }).format(date);
}

async function resolveArticlePageByAlias(articleSlugSeed: string) {
    const requestedSlug = normalizeSlugPart(articleSlugSeed, 'articulo');
    let currentSlug = requestedSlug;
    const visited = new Set<string>();

    while (currentSlug && !visited.has(currentSlug)) {
        visited.add(currentSlug);

        const slugRedirect = await prisma.articleSlugRedirect.findUnique({
            where: { fromSlug: currentSlug },
            select: { toSlug: true },
        });
        const redirectedSlug = normalizeSlugPart(slugRedirect?.toSlug || '', '');
        if (redirectedSlug && redirectedSlug !== currentSlug) {
            currentSlug = redirectedSlug;
            continue;
        }

        const page = await prisma.page.findUnique({
            where: { slug: buildArticlePageSlug(currentSlug) },
            include: { blocks: { orderBy: { order: 'asc' } } },
        });
        if (page) {
            return { articleSlug: currentSlug, page };
        }
        break;
    }

    if (currentSlug !== requestedSlug) {
        const fallbackPage = await prisma.page.findUnique({
            where: { slug: buildArticlePageSlug(requestedSlug) },
            include: { blocks: { orderBy: { order: 'asc' } } },
        });
        if (fallbackPage) {
            return { articleSlug: requestedSlug, page: fallbackPage };
        }
    }

    return null;
}

type PublishSyncResult = {
    ok: boolean;
    syncedLoopgrids: number;
    articleSlug: string | null;
    pageSlug: string | null;
    publicPath: string | null;
    adminPath: string | null;
    reason?: string;
};

export async function publishPageAndSyncArticles(pageId: string): Promise<PublishSyncResult> {
    const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: {
            blocks: { orderBy: { order: 'asc' } },
        },
    });

    if (!page) {
        return {
            ok: false,
            syncedLoopgrids: 0,
            articleSlug: null,
            pageSlug: null,
            publicPath: null,
            adminPath: null,
            reason: 'page_not_found',
        };
    }

    if (!isArticlePageSlug(page.slug)) {
        revalidatePath('/');
        revalidatePath('/admin');
        return {
            ok: true,
            syncedLoopgrids: 0,
            articleSlug: null,
            pageSlug: page.slug,
            publicPath: null,
            adminPath: buildAdminEditPath(page.slug),
            reason: 'not_article_page',
        };
    }

    const currentArticleSlug = extractArticleSlugPart(page.slug);
    const articleMeta = extractArticleMeta(page);
    const articleSlug = currentArticleSlug;
    const nextPageSlug = page.slug;
    const publicPath = buildArticlePublicPath(articleSlug);
    const oldPublicPath = buildArticlePublicPath(currentArticleSlug);
    const adminPath = buildAdminEditPath(nextPageSlug);
    const defaultDate = formatBlogDate(new Date());
    const redirectMap = await loadArticleRedirectMap(currentArticleSlug);
    const canonicalArticleSlug = articleSlug;

    const loopgridBlocks = await prisma.block.findMany({
        where: { type: 'loopgrid' },
        select: { id: true, data: true },
    });

    let syncedLoopgrids = 0;
    const transactionOps: any[] = [];

    for (const loopgrid of loopgridBlocks) {
        const loopData = parseJsonObject(loopgrid.data);
        const postType = String(loopData.postType || 'blog');
        if (postType !== 'blog') continue;

        const sourceItems = Array.isArray(loopData.items) ? loopData.items : [];
        const items = sourceItems.map((item: any) => normalizeLoopGridItem(item, redirectMap));

        let foundIndex = -1;
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            const itemSlug = resolveRedirectedSlug(getLoopItemSlug(item), redirectMap);
            if (itemSlug && itemSlug === canonicalArticleSlug) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex >= 0) {
            const current = items[foundIndex];
            items[foundIndex] = {
                ...current,
                title: articleMeta.title || current.title || 'Artículo',
                excerpt: articleMeta.excerpt || current.excerpt || '',
                image: articleMeta.image || current.image || '',
                href: publicPath,
                articleSlug,
                date: String(current.date || '').trim() || defaultDate,
            };
        } else {
            const fallbackCategory = String(items[0]?.category || '').trim() || 'General';
            items.unshift({
                title: articleMeta.title || 'Artículo',
                category: fallbackCategory,
                date: defaultDate,
                excerpt: articleMeta.excerpt || '',
                image: articleMeta.image || '',
                href: publicPath,
                articleSlug,
            });
        }

        loopData.items = dedupeLoopItems(items, redirectMap, articleSlug);
        transactionOps.push(
            prisma.block.update({
                where: { id: loopgrid.id },
                data: { data: JSON.stringify(loopData) },
            })
        );
        syncedLoopgrids += 1;
    }

    const pageTitleNeedsUpdate = page.title !== articleMeta.title;
    const pageDescriptionNeedsUpdate = (page.description || '') !== (articleMeta.excerpt || '');
    if (pageTitleNeedsUpdate || pageDescriptionNeedsUpdate) {
        transactionOps.push(prisma.page.update({
            where: { id: page.id },
            data: {
                title: articleMeta.title,
                description: articleMeta.excerpt || null,
            },
        }));
    }

    transactionOps.push(
        prisma.articleSlugRedirect.deleteMany({
            where: { fromSlug: currentArticleSlug },
        })
    );

    if (transactionOps.length > 0) {
        await prisma.$transaction(transactionOps);
    }

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(oldPublicPath);
    revalidatePath(publicPath);

    return {
        ok: true,
        syncedLoopgrids,
        articleSlug,
        pageSlug: nextPageSlug,
        publicPath,
        adminPath,
    };
}

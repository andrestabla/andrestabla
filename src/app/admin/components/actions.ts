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
    await prisma.block.update({
        where: { id },
        data: { data: newData }
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
    const slugSeed = input.articleSlug || input.title || 'articulo';
    const articleSlug = normalizeSlugPart(slugSeed);
    const pageSlug = buildArticlePageSlug(articleSlug);
    const pageTitle = (input.title || '').trim() || humanizeSlug(articleSlug);
    const pageDescription = (input.excerpt || '').trim();
    const coverImage = (input.image || '').trim();

    let page = await prisma.page.findUnique({
        where: { slug: pageSlug },
        include: { blocks: { orderBy: { order: 'asc' } } },
    });

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
                title: page.title || pageTitle,
                description: page.description || pageDescription || null,
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

function formatBlogDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'America/Bogota',
    }).format(date);
}

async function resolveUniqueArticleSlug(baseSlug: string, pageId: string): Promise<string> {
    const cleanBase = normalizeSlugPart(baseSlug, 'articulo');
    let attempt = 0;

    while (attempt < 50) {
        const candidate = attempt === 0 ? cleanBase : normalizeSlugPart(`${cleanBase}-${attempt + 1}`, 'articulo');
        const candidatePageSlug = buildArticlePageSlug(candidate);
        const existing = await prisma.page.findUnique({
            where: { slug: candidatePageSlug },
            select: { id: true },
        });

        if (!existing || existing.id === pageId) {
            return candidate;
        }

        attempt += 1;
    }

    return normalizeSlugPart(`${cleanBase}-${Date.now()}`, 'articulo');
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
    const preferredArticleSlug = normalizeSlugPart(articleMeta.title || currentArticleSlug, currentArticleSlug);
    const articleSlug = await resolveUniqueArticleSlug(preferredArticleSlug, page.id);
    const nextPageSlug = buildArticlePageSlug(articleSlug);
    const publicPath = buildArticlePublicPath(articleSlug);
    const oldPublicPath = buildArticlePublicPath(currentArticleSlug);
    const adminPath = buildAdminEditPath(nextPageSlug);
    const defaultDate = formatBlogDate(new Date());

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
        const items = sourceItems.map((item: any) =>
            item && typeof item === 'object' ? { ...item } : {}
        );

        let foundIndex = -1;
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            const itemSlug = normalizeSlugPart(
                String(item.articleSlug || '').trim() || extractSlugFromHref(item.href || '')
            );
            if (itemSlug === currentArticleSlug || itemSlug === articleSlug) {
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

        loopData.items = items;
        transactionOps.push(
            prisma.block.update({
                where: { id: loopgrid.id },
                data: { data: JSON.stringify(loopData) },
            })
        );
        syncedLoopgrids += 1;
    }

    const pageSlugNeedsUpdate = page.slug !== nextPageSlug;
    const pageTitleNeedsUpdate = page.title !== articleMeta.title;
    const pageDescriptionNeedsUpdate = (page.description || '') !== (articleMeta.excerpt || '');
    if (pageSlugNeedsUpdate || pageTitleNeedsUpdate || pageDescriptionNeedsUpdate) {
        transactionOps.push(prisma.page.update({
            where: { id: page.id },
            data: {
                slug: nextPageSlug,
                title: articleMeta.title,
                description: articleMeta.excerpt || null,
            },
        }));
    }

    if (pageSlugNeedsUpdate) {
        transactionOps.push(
            prisma.articleSlugRedirect.upsert({
                where: { fromSlug: currentArticleSlug },
                update: { toSlug: articleSlug },
                create: {
                    fromSlug: currentArticleSlug,
                    toSlug: articleSlug,
                },
            })
        );
        transactionOps.push(
            prisma.articleSlugRedirect.updateMany({
                where: {
                    toSlug: currentArticleSlug,
                    NOT: { fromSlug: currentArticleSlug },
                },
                data: { toSlug: articleSlug },
            })
        );
        // Prevent accidental self/loop redirects if slugs were reused.
        transactionOps.push(
            prisma.articleSlugRedirect.deleteMany({
                where: { fromSlug: articleSlug, toSlug: currentArticleSlug },
            })
        );
    }

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

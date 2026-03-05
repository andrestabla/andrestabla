'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
    buildAdminEditPath,
    buildArticlePageSlug,
    buildArticlePublicPath,
    humanizeSlug,
    normalizeSlugPart,
} from '@/lib/articlePages';

// Update a single block's JSON data
export async function updateBlockData(id: string, newData: string) {
    await prisma.block.update({
        where: { id },
        data: { data: newData }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

// Update a single block's styling overrides (backgrounds, paddings)
export async function updateBlockStyles(id: string, newStyles: string) {
    await prisma.block.update({
        where: { id },
        data: { styles: newStyles }
    });
    revalidatePath('/');
    revalidatePath('/admin');
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
    revalidatePath('/');
    revalidatePath('/admin');
}

// Delete a block
export async function deleteBlock(id: string) {
    await prisma.block.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
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
    revalidatePath('/');
    revalidatePath('/admin');
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

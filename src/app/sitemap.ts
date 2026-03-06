import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { absoluteUrl } from '@/lib/seo';
import { buildArticlePublicPath, extractArticleSlugPart, isArticlePageSlug } from '@/lib/articlePages';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const pages = await prisma.page.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
    });

    const map = new Map<string, MetadataRoute.Sitemap[number]>();

    map.set(absoluteUrl('/'), {
        url: absoluteUrl('/'),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
    });
    map.set(absoluteUrl('/articulos'), {
        url: absoluteUrl('/articulos'),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
    });

    for (const page of pages) {
        let path = '/';
        let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly';
        let priority = 0.8;

        if (page.slug === 'home') {
            path = '/';
            changeFrequency = 'weekly';
            priority = 1;
        } else if (isArticlePageSlug(page.slug)) {
            path = buildArticlePublicPath(extractArticleSlugPart(page.slug));
            changeFrequency = 'monthly';
            priority = 0.7;
        } else {
            continue;
        }

        const url = absoluteUrl(path);
        const previous = map.get(url);
        if (!previous || new Date(previous.lastModified || 0) < page.updatedAt) {
            map.set(url, {
                url,
                lastModified: page.updatedAt,
                changeFrequency,
                priority,
            });
        }
    }

    return Array.from(map.values()).sort((a, b) => String(a.url).localeCompare(String(b.url)));
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import GlobalNav from '@/components/GlobalNav';
import BlockRenderer from '@/app/components/BlockRenderer';
import AndresAssistant from '@/components/AndresAssistant';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import DataPolicyConsent from '@/components/DataPolicyConsent';
import { buildArticlePageSlug, buildArticlePublicPath, normalizeSlugPart } from '@/lib/articlePages';
import {
    absoluteUrl,
    DEFAULT_SEO_DESCRIPTION,
    extractFirstImageFromBlocks,
    extractFirstRichTextExcerptFromBlocks,
    SITE_NAME,
} from '@/lib/seo';

export const dynamic = 'force-dynamic';

type ArticlePageProps = {
    params: Promise<{ slug: string }>;
};

async function getArticleRecord(pageSlug: string) {
    return prisma.page.findUnique({
        where: { slug: pageSlug },
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            blocks: {
                orderBy: { order: 'asc' },
                select: { type: true, data: true },
            },
        },
    });
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const articleSlugPart = normalizeSlugPart(resolvedParams?.slug || 'articulo');
    const pageSlug = buildArticlePageSlug(articleSlugPart);
    const articleRecord = await getArticleRecord(pageSlug);

    if (!articleRecord) {
        return {
            title: `Artículo no encontrado | ${SITE_NAME}`,
            robots: { index: false, follow: false },
        };
    }

    const canonicalPath = buildArticlePublicPath(articleSlugPart);
    const canonicalUrl = absoluteUrl(canonicalPath);
    const title = (articleRecord.title || '').trim() || 'Artículo';
    const description =
        (articleRecord.description || '').trim() ||
        extractFirstRichTextExcerptFromBlocks(articleRecord.blocks, 180) ||
        DEFAULT_SEO_DESCRIPTION;
    const rawImage = extractFirstImageFromBlocks(articleRecord.blocks);
    const imageUrl = rawImage ? absoluteUrl(rawImage) : undefined;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            type: 'article',
            title,
            description,
            url: canonicalUrl,
            siteName: SITE_NAME,
            locale: 'es_CO',
            publishedTime: articleRecord.createdAt.toISOString(),
            modifiedTime: articleRecord.updatedAt.toISOString(),
            images: imageUrl ? [{ url: imageUrl }] : undefined,
        },
        twitter: {
            card: imageUrl ? 'summary_large_image' : 'summary',
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const resolvedParams = await params;
    const articleSlugPart = normalizeSlugPart(resolvedParams?.slug || 'articulo');
    const pageSlug = buildArticlePageSlug(articleSlugPart);

    const [siteConfig, articlePage] = await Promise.all([
        prisma.siteSettings.findFirst(),
        getArticleRecord(pageSlug),
    ]);

    if (!articlePage) {
        notFound();
    }

    let parsedStyles: any = {
        footerStyle: 'minimal',
        footerText: 'Powered by NodeBuilder™',
        footerBg: '#09090b',
        footerBorder: '#18181b',
        footerTextColor: '#71717a',
        footerAccentColor: '#f25c54',
    };
    if (siteConfig?.globalStyles) {
        try {
            parsedStyles = { ...parsedStyles, ...JSON.parse(siteConfig.globalStyles) };
        } catch (_error) {
            // Ignore invalid JSON in style payload.
        }
    }

    const footerStyle = parsedStyles.footerStyle || 'minimal';
    const footerText = parsedStyles.footerText || 'Powered by NodeBuilder™';
    const footerBaseStyle = {
        backgroundColor: parsedStyles.footerBg,
        borderColor: parsedStyles.footerBorder,
        color: parsedStyles.footerTextColor,
    };
    const articlePath = buildArticlePublicPath(articleSlugPart);
    const articleUrl = absoluteUrl(articlePath);
    const articleDescription =
        (articlePage.description || '').trim() ||
        extractFirstRichTextExcerptFromBlocks(articlePage.blocks, 180) ||
        DEFAULT_SEO_DESCRIPTION;
    const rawImage = extractFirstImageFromBlocks(articlePage.blocks);
    const articleImage = rawImage ? absoluteUrl(rawImage) : absoluteUrl('/favicon.ico');
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: articlePage.title || 'Artículo',
        description: articleDescription,
        image: [articleImage],
        inLanguage: 'es-CO',
        author: {
            '@type': 'Person',
            name: 'Andrés Tabla Rico',
            url: absoluteUrl('/'),
        },
        publisher: {
            '@type': 'Person',
            name: 'Andrés Tabla Rico',
            url: absoluteUrl('/'),
        },
        datePublished: articlePage.createdAt.toISOString(),
        dateModified: articlePage.updatedAt.toISOString(),
        mainEntityOfPage: articleUrl,
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: absoluteUrl('/'),
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Artículos',
                item: absoluteUrl('/#articulos'),
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: articlePage.title || 'Artículo',
                item: articleUrl,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-300 antialiased selection:bg-[#f25c54] selection:text-white pb-24 relative overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <DataPolicyConsent />
            <AnalyticsTracker />

            <GlobalNav siteConfig={siteConfig} />

            <BlockRenderer pageSlug={pageSlug} />

            <footer className="w-full border-t mt-24" style={footerBaseStyle}>
                {footerStyle === 'split' ? (
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs font-bold uppercase tracking-[0.16em]">
                        <span>{siteConfig?.title || 'Andrés Tabla'} &copy; {new Date().getFullYear()}</span>
                        <span style={{ color: parsedStyles.footerAccentColor }}>{footerText}</span>
                    </div>
                ) : footerStyle === 'centered' ? (
                    <div className="text-center px-6 py-10">
                        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: parsedStyles.footerAccentColor }}>
                            {siteConfig?.title || 'Andrés Tabla'} &copy; {new Date().getFullYear()}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mt-2">{footerText}</p>
                    </div>
                ) : (
                    <div className="text-center px-6 py-10">
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">
                            {siteConfig?.title || 'Andrés Tabla'} &copy; {new Date().getFullYear()}
                            <span className="mx-2" style={{ color: parsedStyles.footerAccentColor }}>&bull;</span>
                            {footerText}
                        </p>
                    </div>
                )}
            </footer>

            <AndresAssistant />
        </div>
    );
}

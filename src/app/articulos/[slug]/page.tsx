import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import GlobalNav from '@/components/GlobalNav';
import BlockRenderer from '@/app/components/BlockRenderer';
import AndresAssistant from '@/components/AndresAssistant';
import { buildArticlePageSlug, normalizeSlugPart } from '@/lib/articlePages';

export const dynamic = 'force-dynamic';

type ArticlePageProps = {
    params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
    const resolvedParams = await params;
    const articleSlugPart = normalizeSlugPart(resolvedParams?.slug || 'articulo');
    const pageSlug = buildArticlePageSlug(articleSlugPart);

    const [siteConfig, articlePage] = await Promise.all([
        prisma.siteSettings.findFirst(),
        prisma.page.findUnique({
            where: { slug: pageSlug },
            select: { id: true },
        }),
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

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-300 antialiased selection:bg-[#f25c54] selection:text-white pb-24 relative overflow-x-hidden">
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

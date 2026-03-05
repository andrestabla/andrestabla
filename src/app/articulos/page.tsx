import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import GlobalNav from '@/components/GlobalNav';
import AndresAssistant from '@/components/AndresAssistant';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import DataPolicyConsent from '@/components/DataPolicyConsent';
import AutoTranslatePage from '@/components/AutoTranslatePage';
import { absoluteUrl, DEFAULT_SEO_DESCRIPTION, SITE_NAME } from '@/lib/seo';
import { getPublishedBlogItems } from '@/lib/blogCatalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: `Artículos | ${SITE_NAME}`,
    description: DEFAULT_SEO_DESCRIPTION,
    alternates: {
        canonical: '/articulos',
    },
};

export default async function ArticlesIndexPage() {
    const [siteConfig, articles] = await Promise.all([
        prisma.siteSettings.findFirst(),
        getPublishedBlogItems(),
    ]);

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
            // Ignore invalid JSON
        }
    }

    const footerStyle = parsedStyles.footerStyle || 'minimal';
    const footerText = parsedStyles.footerText || 'Powered by NodeBuilder™';
    const footerBaseStyle = {
        backgroundColor: parsedStyles.footerBg,
        borderColor: parsedStyles.footerBorder,
        color: parsedStyles.footerTextColor,
    };

    const listSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Artículos',
        description: 'Listado de artículos publicados',
        url: absoluteUrl('/articulos'),
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: articles.map((article, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: absoluteUrl(article.href),
                name: article.title,
            })),
        },
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-300 antialiased selection:bg-[#f25c54] selection:text-white pb-24 relative overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
            />

            <DataPolicyConsent />
            <AnalyticsTracker />
            <AutoTranslatePage />

            <GlobalNav siteConfig={siteConfig} />

            <main data-auto-translate-root="true" className="max-w-6xl mx-auto px-6 md:px-12 pt-28">
                <section className="mb-10 md:mb-14">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">Blog</p>
                    <h1 className="text-4xl md:text-5xl font-black text-white font-heading tracking-tight">
                        Todos los artículos
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-slate-400">
                        {articles.length} artículo{articles.length === 1 ? '' : 's'} publicados, ordenados por fecha.
                    </p>
                </section>

                {articles.length === 0 ? (
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-slate-400">
                        Aún no hay artículos publicados.
                    </section>
                ) : (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {articles.map((article) => (
                            <article
                                key={article.articleSlug || `${article.title}-${article.href}`}
                                className="group flex flex-col bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {article.image && (
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${article.image})` }}
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-full text-slate-800 dark:text-zinc-200 shadow-sm">
                                            {article.category}
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 flex flex-col flex-1">
                                    {article.date && (
                                        <time className="text-xs font-medium text-slate-400 dark:text-zinc-500 mb-2">
                                            {article.date}
                                        </time>
                                    )}
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2 leading-tight group-hover:text-indigo-500 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 flex-1">
                                        {article.excerpt || 'Sin descripción'}
                                    </p>

                                    <a
                                        href={article.href}
                                        className="mt-auto flex items-center text-xs font-bold uppercase tracking-widest text-indigo-500 group-hover:translate-x-2 transition-transform"
                                    >
                                        Leer más <ArrowRight size={14} className="ml-1" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>

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

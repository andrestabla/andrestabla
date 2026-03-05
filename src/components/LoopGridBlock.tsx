'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { buildArticlePublicPath, normalizeSlugPart } from '@/lib/articlePages';

type LoopItem = {
    id?: string | number;
    title?: string;
    category?: string;
    date?: string;
    excerpt?: string;
    image?: string;
    href?: string;
    articleSlug?: string;
};

const DEFAULT_BLOG_ITEMS: LoopItem[] = [
    {
        id: 1,
        title: 'El Futuro del Desarrollo Web',
        category: 'Tecnología',
        date: 'Mar 02, 2026',
        excerpt: 'Explorando estrategias modernas con Next.js y arquitecturas híbridas.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
        articleSlug: 'futuro-del-desarrollo-web',
        href: '/articulos/futuro-del-desarrollo-web',
    },
    {
        id: 2,
        title: 'Minimalismo en Diseño UI',
        category: 'Diseño',
        date: 'Feb 18, 2026',
        excerpt: 'Cómo reducir fricción visual y mejorar la conversión con layouts claros.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
        articleSlug: 'minimalismo-en-diseno-ui',
        href: '/articulos/minimalismo-en-diseno-ui',
    },
    {
        id: 3,
        title: 'SEO Técnico para Portafolios',
        category: 'Marketing',
        date: 'Ene 30, 2026',
        excerpt: 'Checklist práctico para posicionar tu sitio de servicios profesionales.',
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop',
        articleSlug: 'seo-tecnico-para-portafolios',
        href: '/articulos/seo-tecnico-para-portafolios',
    },
];

const DEFAULT_PORTFOLIO_ITEMS: LoopItem[] = [
    {
        id: 1,
        title: 'Rediseño de Plataforma SaaS',
        category: 'UX/UI',
        date: '2026',
        excerpt: 'Sistema de diseño, landing y panel administrativo para producto B2B.',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
    {
        id: 2,
        title: 'App de Gestión Comercial',
        category: 'App',
        date: '2025',
        excerpt: 'Aplicación de ventas con panel de analítica y flujos automatizados.',
        image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
    {
        id: 3,
        title: 'Portal Corporativo Multilingüe',
        category: 'Web',
        date: '2025',
        excerpt: 'Sitio institucional con CMS, performance optimizada y SEO internacional.',
        image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
];

const getFallbackItems = (postType: string): LoopItem[] =>
    postType === 'portfolio' ? DEFAULT_PORTFOLIO_ITEMS : DEFAULT_BLOG_ITEMS;

export default function LoopGridBlock({ data }: { data: any }) {
    const postType = data.postType || 'blog';
    const columns = data.columns || 'grid-cols-1 md:grid-cols-3';
    const limit = data.limit || 3;
    const showImage = data.showImage !== undefined ? data.showImage : true;

    const sourceItems = Array.isArray(data.items) && data.items.length > 0
        ? data.items
        : getFallbackItems(postType);

    const items = sourceItems.slice(0, limit);

    const sectionTitle =
        postType === 'portfolio'
            ? 'Últimos Proyectos'
            : 'Últimos Artículos';

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h3
                    className="text-xl font-bold font-heading text-slate-800 dark:text-zinc-100"
                    style={{ color: 'var(--block-heading)' }}
                >
                    {sectionTitle}
                </h3>
                <a href="#" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors">
                    Ver Todos <ArrowRight size={14} className="ml-1" />
                </a>
            </div>

            <div className={`grid ${columns} gap-6 md:gap-8`}>
                {items.map((post: LoopItem, idx: number) => {
                    const articleSlug = post.articleSlug ? normalizeSlugPart(post.articleSlug) : '';
                    const articleHref = articleSlug ? buildArticlePublicPath(articleSlug) : '';
                    const destination =
                        postType === 'blog'
                            ? articleHref || post.href || '#'
                            : post.href || '#';

                    return (
                        <article key={post.id || `${post.title}-${idx}`} className="group cursor-pointer flex flex-col bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            {showImage && post.image && (
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${post.image})` }}></div>
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-full text-slate-800 dark:text-zinc-200 shadow-sm">
                                        {post.category || 'General'}
                                    </div>
                                </div>
                            )}

                            <div className="p-6 flex flex-col flex-1">
                                {post.date && <time className="text-xs font-medium text-slate-400 dark:text-zinc-500 mb-2">{post.date}</time>}
                                <h4 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-2 leading-tight group-hover:text-indigo-500 transition-colors">{post.title || 'Sin título'}</h4>
                                <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 flex-1">{post.excerpt || 'Sin descripción'}</p>

                                <a href={destination} className="mt-auto flex items-center text-xs font-bold uppercase tracking-widest text-indigo-500 group-hover:translate-x-2 transition-transform">
                                    Leer más <ArrowRight size={14} className="ml-1" />
                                </a>
                            </div>
                        </article>
                    );
                })}
            </div>

            <a href="#" className="md:hidden mt-8 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 py-3 rounded-xl transition-colors">
                Ver Todos <ArrowRight size={14} className="ml-1" />
            </a>
        </div>
    );
}

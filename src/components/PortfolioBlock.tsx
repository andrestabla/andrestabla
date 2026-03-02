'use client';

import React, { useState } from 'react';
import { safeHtml } from '@/lib/html';

const DEFAULT_ITEMS = [
    { title: 'Project Alpha', category: 'web', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop', link: '#', hoverText: 'Landing + sistema de conversión para negocio digital.' },
    { title: 'Brand Identity', category: 'design', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop', link: '#', hoverText: 'Rediseño de identidad visual y kit de marca.' },
    { title: 'Mobile App', category: 'app', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop', link: '#', hoverText: 'Aplicación móvil con panel de analítica en tiempo real.' },
    { title: 'E-commerce', category: 'web', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop', link: '#', hoverText: 'Tienda digital con checkout optimizado.' },
];

const toFilterLabel = (value: string) =>
    value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export default function PortfolioBlock({ data }: { data: any }) {
    const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : DEFAULT_ITEMS;

    const categories = Array.from(
        new Set<string>(
            items
                .map((item: any) => String(item.category || '').trim())
                .filter((value: string) => Boolean(value))
        )
    );

    const filters = [
        { label: 'Todos', value: 'all' },
        ...categories.map((category) => ({
            label: toFilterLabel(category),
            value: category,
        })),
    ];

    const columns = data.columns || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    const gap = data.gap || 'gap-4';

    const [activeFilter, setActiveFilter] = useState('all');

    const filteredItems = items.filter((item: any) => {
        if (activeFilter === 'all') return true;
        return (item.category || '').trim() === activeFilter;
    });

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-8">
                {filters.map((f: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setActiveFilter(f.value)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeFilter === f.value ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
                    >
                        <span dangerouslySetInnerHTML={safeHtml(f.label)} />
                    </button>
                ))}
            </div>

            <div className={`grid ${columns} ${gap}`}>
                {filteredItems.map((item: any, idx: number) => {
                    const content = (
                        <>
                            <img
                                src={item.image}
                                alt={item.title || `Proyecto ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-indigo-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                                <h4 className="text-xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300" dangerouslySetInnerHTML={safeHtml(item.title || `Proyecto ${idx + 1}`)} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75" dangerouslySetInnerHTML={safeHtml(item.category || 'General')} />
                                {item.hoverText && (
                                    <p
                                        className="mt-3 text-xs text-slate-100 leading-relaxed max-w-[240px] translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                                        dangerouslySetInnerHTML={safeHtml(item.hoverText)}
                                    />
                                )}
                            </div>
                        </>
                    );

                    if (item.link) {
                        return (
                            <a
                                key={`${item.title}-${idx}`}
                                href={item.link}
                                className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer animate-in fade-in zoom-in duration-500"
                            >
                                {content}
                            </a>
                        );
                    }

                    return (
                        <div key={`${item.title}-${idx}`} className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer animate-in fade-in zoom-in duration-500">
                            {content}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

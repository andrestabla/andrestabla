'use client';

import React, { useState } from 'react';
import { safeHtml } from '@/lib/html';

export default function PortfolioBlock({ data }: { data: any }) {
    const items = data.items || [
        { title: 'Project Alpha', category: 'web', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop' },
        { title: 'Brand Identity', category: 'design', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop' },
        { title: 'Mobile App', category: 'app', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop' },
        { title: 'E-commerce', category: 'web', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop' }
    ];

    const filters = data.filters || [
        { label: 'Todos', value: 'all' },
        { label: 'Web Dev', value: 'web' },
        { label: 'Diseño', value: 'design' },
        { label: 'Apps', value: 'app' }
    ];

    const columns = data.columns || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    const gap = data.gap || 'gap-4';

    const [activeFilter, setActiveFilter] = useState('all');

    const filteredItems = items.filter((item: any) => activeFilter === 'all' || item.category === activeFilter);

    return (
        <div className="w-full">
            {/* Filter Bar */}
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

            {/* Grid */}
            <div className={`grid ${columns} ${gap}`}>
                {filteredItems.map((item: any, idx: number) => (
                    <div key={`${item.title}-${idx}`} className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer animate-in fade-in zoom-in duration-500">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-indigo-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                            <h4 className="text-xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300" dangerouslySetInnerHTML={safeHtml(item.title)} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75" dangerouslySetInnerHTML={safeHtml(item.category)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

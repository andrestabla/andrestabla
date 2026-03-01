'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LoopGridBlock({ data }: { data: any }) {
    // In a real Elementor-like Pro widget, this would fetch from a database table (e.g. Prisma `Post` or `Project`).
    // For this Builder, we simulate the "Loop" passing manual or mock database items.

    const postType = data.postType || 'blog'; // blog, portfolio, services
    const columns = data.columns || 'grid-cols-1 md:grid-cols-3';
    const limit = data.limit || 3;
    const showImage = data.showImage !== undefined ? data.showImage : true;

    // Simulated Database entries
    const mockPosts = [
        { id: 1, title: 'El Futuro del Desarrollo Web', category: 'Tecnología', date: 'Oct 12, 2023', excerpt: 'Explorando Next.js 14 y Server Actions.', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop' },
        { id: 2, title: 'Minimalismo en Diseño UI', category: 'Diseño', date: 'Nov 05, 2023', excerpt: 'Menos es más cuando se trata de interfaces de usuario.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop' },
        { id: 3, title: 'Optimización SEO 2024', category: 'Marketing', date: 'Dic 20, 2023', excerpt: 'Guía definitiva para posicionar tu web top 1 en Google.', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop' },
        { id: 4, title: 'Liderazgo Remoto', category: 'Management', date: 'Ene 15, 2024', excerpt: 'Cómo gestionar equipos distribuidos por el mundo.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop' },
    ].slice(0, limit);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-zinc-100">
                    Últimas Entradas ({postType})
                </h3>
                <a href="#" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors">
                    Ver Todos <ArrowRight size={14} className="ml-1" />
                </a>
            </div>

            <div className={`grid ${columns} gap-6 md:gap-8`}>
                {mockPosts.map((post) => (
                    <article key={post.id} className="group cursor-pointer flex flex-col bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                        {showImage && (
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${post.image})` }}></div>
                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-full text-slate-800 dark:text-zinc-200 shadow-sm">
                                    {post.category}
                                </div>
                            </div>
                        )}

                        <div className="p-6 flex flex-col flex-1">
                            <time className="text-xs font-medium text-slate-400 dark:text-zinc-500 mb-2">{post.date}</time>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-2 leading-tight group-hover:text-indigo-500 transition-colors">{post.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 flex-1">{post.excerpt}</p>

                            <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-widest text-indigo-500 group-hover:translate-x-2 transition-transform">
                                Leer más <ArrowRight size={14} className="ml-1" />
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <a href="#" className="md:hidden mt-8 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 py-3 rounded-xl transition-colors">
                Ver Todos <ArrowRight size={14} className="ml-1" />
            </a>
        </div>
    );
}

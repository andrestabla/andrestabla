'use client';

import { motion } from 'framer-motion';
import { safeHtml } from '@/lib/html';

export default function TimelineBlock({ data }: { data: any }) {
    const items = data.items || [];

    return (
        <section className="w-full py-24 border-t border-zinc-900 relative">

            <div className="max-w-4xl mx-auto px-6 w-full">
                {data.title && (
                    <div className="mb-16 flex items-center gap-6">
                        <h3 className="text-4xl md:text-5xl font-bold text-white m-0" style={{ fontFamily: 'var(--font-heading)' }} dangerouslySetInnerHTML={safeHtml(data.title)} />
                        <div className="h-[1px] flex-1 bg-zinc-800"></div>
                    </div>
                )}

                {/* Timeline */}
                <div className="relative border-l-2 border-zinc-800 ml-4 space-y-16">
                    {items.map((item: any, idx: number) => (
                        <motion.div
                            key={item.id || idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative pl-8 md:pl-12 group"
                        >
                            {/* Glowing Dot */}
                            <div className="absolute left-[-9px] top-2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:border-[var(--brand)] transition-colors duration-300 z-10">
                                <div className="absolute inset-0 rounded-full bg-[var(--brand)] opacity-0 group-hover:opacity-100 scale-50 transition-all duration-300"></div>
                            </div>

                            {item.meta && (
                                <span className="inline-block mb-3 px-4 py-1.5 bg-zinc-900 text-[var(--brand)] text-xs font-bold uppercase tracking-widest rounded-full border border-zinc-800" dangerouslySetInnerHTML={safeHtml(item.meta)} />
                            )}

                            {/* Card */}
                            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-500 group-hover:-translate-y-1">
                                <h4 className="text-xl md:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }} dangerouslySetInnerHTML={safeHtml(item.title, 'Título')} />
                                {item.subtitle && <p className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-4" dangerouslySetInnerHTML={safeHtml(item.subtitle)} />}
                                {item.body && (
                                    <div
                                        className="rich-html text-slate-400 leading-relaxed font-light text-base"
                                        dangerouslySetInnerHTML={safeHtml(item.body)}
                                    />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

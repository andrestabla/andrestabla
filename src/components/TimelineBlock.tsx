'use client';

import { motion } from 'framer-motion';

export default function TimelineBlock({ data }: { data: any }) {
    const items = data.items || [];

    return (
        <section className="w-full py-24 border-t border-zinc-900 relative">

            {data.title && (
                <div className="mb-24 flex items-center gap-6">
                    <h3 className="text-4xl md:text-5xl font-bold text-white m-0" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.title}
                    </h3>
                    <div className="h-[1px] flex-1 bg-zinc-800"></div>
                </div>
            )}

            {/* Material CV Inspired Timeline Architecture */}
            <div className="relative border-l-2 border-zinc-800 ml-4 md:ml-1/2 space-y-16">
                {items.map((item: any, idx: number) => (
                    <motion.div
                        key={item.id || idx}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full pl-8 md:pl-16 group"
                    >
                        {/* Timeline Glowing Dot */}
                        <div className="absolute left-[-9px] top-2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:border-[#f25c54] transition-colors duration-300 z-10">
                            <div className="absolute inset-0 rounded-full bg-[#f25c54] opacity-0 group-hover:opacity-100 scale-50 transition-all duration-300"></div>
                        </div>

                        <div className="grid md:grid-cols-[1fr_2.5fr] gap-4 md:gap-12 items-baseline w-full">

                            <div className="md:text-right md:absolute md:left-[-280px] md:top-1.5 md:w-[240px]">
                                <span className="inline-block px-4 py-1.5 bg-zinc-900 text-[#f25c54] text-xs font-bold uppercase tracking-widest rounded-full border border-zinc-800">{item.meta}</span>
                            </div>

                            {/* Glassmorphism Card */}
                            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-500 group-hover:-translate-y-2">
                                <h4 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h4>
                                {item.subtitle && <p className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-6">{item.subtitle}</p>}
                                {item.body && <p className="text-slate-400 leading-relaxed font-light text-base md:text-lg">{item.body}</p>}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

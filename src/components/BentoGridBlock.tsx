'use client';

import { motion, Variants } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Code, BookOpen } from 'lucide-react';
import { safeHtml } from '@/lib/html';

export default function BentoGridBlock({ data }: { data: any }) {

    const bentoType = data.bentoType || 'general';

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemAnim: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <section className="w-full py-24 border-t border-zinc-900 relative">

            {data.title && (
                <div className="mb-16 flex items-center justify-between">
                    <h3 className="text-4xl md:text-5xl font-bold text-white m-0" style={{ fontFamily: 'var(--font-heading)' }} dangerouslySetInnerHTML={safeHtml(data.title)} />
                </div>
            )}

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {(data.items || []).map((item: any, idx: number) => {

                    // Size variations for the bento layout
                    const isLarge = idx === 0 && bentoType !== 'courses';
                    const spanClass = isLarge ? "md:col-span-2 lg:col-span-2" : "col-span-1";

                    return (
                        <motion.div
                            key={item.id || idx}
                            variants={itemAnim}
                            className={`group relative overflow-hidden bg-zinc-900/40 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between ${spanClass}`}
                        >
                            {/* Neon Top Border on Hover */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand)] to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10 flex-1">
                                {bentoType === 'education' && (
                                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <GraduationCap size={20} className="text-[var(--brand)]" />
                                    </div>
                                )}
                                {(bentoType === 'courses' || bentoType === 'general') && (
                                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--brand)] transition-all duration-500">
                                        <Award size={20} className="text-slate-500 group-hover:text-white" />
                                    </div>
                                )}

                                {item.meta && (
                                    <span className="inline-block px-3 py-1 bg-zinc-900 text-[var(--brand)] text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-800 mb-4" dangerouslySetInnerHTML={safeHtml(item.meta)} />
                                )}

                                <h4 className={`font-bold text-white mb-3 ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'}`} style={{ fontFamily: 'var(--font-heading)' }} dangerouslySetInnerHTML={safeHtml(item.title, 'Tarjeta')} />

                                {item.subtitle && <p className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-4" dangerouslySetInnerHTML={safeHtml(item.subtitle)} />}

                                {item.body && (
                                    <p className={`text-slate-400 font-light leading-relaxed ${isLarge ? 'text-lg max-w-2xl' : 'text-sm'}`} dangerouslySetInnerHTML={safeHtml(item.body)} />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}

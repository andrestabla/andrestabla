'use client';

import { motion, Variants } from 'framer-motion';

export default function BentoGridBlock({ data }: { data: any }) {
    const items = data.items || [];
    const bentoType = data.bentoType || 'general'; // 'education', 'courses', etc.

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemAnim: Variants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <section className="w-full">
            {data.title && (
                <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="section-title mb-12"
                >
                    {data.title}
                </motion.h3>
            )}

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className={`grid gap-4 md:gap-6 ${bentoType === 'education' ? 'grid-cols-1 md:grid-cols-3' : bentoType === 'courses' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}
            >
                {items.map((entry: any, idx: number) => (
                    <motion.div
                        key={entry.id || idx}
                        variants={itemAnim}
                        className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col justify-between"
                    >
                        {bentoType === 'education' && (
                            <>
                                <div>
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">{entry.meta}</span>
                                    <h4 className="text-lg font-bold text-slate-900 leading-snug mb-2">{entry.title}</h4>
                                </div>
                                {entry.subtitle && <p className="text-sm text-slate-500 font-medium mt-4">{entry.subtitle}</p>}
                            </>
                        )}

                        {bentoType === 'general' && (
                            <div className="text-sm text-slate-700 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: entry.body || entry.title }} />
                        )}

                        {bentoType === 'courses' && (
                            <div className="flex items-center justify-center h-full text-center">
                                <h4 className="font-semibold text-slate-800 leading-snug">{entry.title}</h4>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

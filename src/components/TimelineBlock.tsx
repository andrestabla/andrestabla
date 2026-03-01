'use client';

import { motion } from 'framer-motion';

export default function TimelineBlock({ data }: { data: any }) {
    const items = data.items || [];

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

            <div className="relative border-l border-slate-200 ml-3 md:ml-0 md:border-none pl-6 md:pl-0 space-y-16">
                {items.map((item: any, idx: number) => (
                    <motion.div
                        key={item.id || idx}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="relative group w-full"
                    >
                        {/* Timeline Dot (Mobile) */}
                        <div className="md:hidden absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-black"></div>

                        <div className="grid md:grid-cols-[1fr_2fr] gap-4 md:gap-12 items-baseline w-full">
                            <div className="md:text-right relative">
                                <span className="text-sm font-bold uppercase tracking-widest text-slate-400 block mb-1">{item.meta}</span>
                                {/* Desktop Line Connector */}
                                <div className="hidden md:block absolute right-[-2.3rem] top-2 w-[2rem] h-[1px] bg-slate-200 group-hover:bg-black transition-colors"></div>
                                <div className="hidden md:block absolute right-[-2.6rem] top-1.5 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-black group-hover:scale-150 transition-all z-10"></div>
                            </div>

                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group-hover:-translate-y-1">
                                <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{item.title}</h4>
                                {item.subtitle && <p className="text-sm font-semibold text-blue-600 mb-4">{item.subtitle}</p>}
                                {item.body && <p className="text-slate-600 leading-relaxed font-light">{item.body}</p>}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {/* Central Vertical Line (Desktop) */}
                <div className="hidden md:block absolute left-[33.33%] top-0 bottom-0 w-[1px] bg-slate-200 -z-10 translate-x-[-1px]"></div>
            </div>
        </section>
    );
}

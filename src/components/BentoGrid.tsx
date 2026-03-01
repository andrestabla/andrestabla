'use client';

import { motion } from 'framer-motion';

export default function BentoGrid({ data, type }: { data: any[], type: 'education' | 'publications' | 'courses' }) {

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className={`grid gap-4 md:gap-6 ${type === 'education' ? 'grid-cols-1 md:grid-cols-3' : type === 'courses' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}
        >
            {data.map((entry) => (
                <motion.div
                    key={entry.id}
                    variants={item}
                    className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                    {type === 'education' && (
                        <>
                            <div>
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">{entry.period}</span>
                                <h4 className="text-lg font-bold text-slate-900 leading-snug mb-2">{entry.degree}</h4>
                            </div>
                            <p className="text-sm text-slate-500 font-medium mt-4">{entry.institution}</p>
                        </>
                    )}

                    {type === 'publications' && (
                        <div className="text-sm text-slate-700 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: entry.content }} />
                    )}

                    {type === 'courses' && (
                        <div className="flex items-center justify-center h-full text-center">
                            <h4 className="font-semibold text-slate-800 leading-snug">{entry.title}</h4>
                        </div>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
}

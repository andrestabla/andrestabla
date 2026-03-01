'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, Link as LinkIcon } from 'lucide-react';

export default function HeroBlock({ data }: { data: any }) {
    return (
        <header className="min-h-[90vh] flex flex-col justify-center items-start py-24 relative overflow-hidden bg-zinc-950">

            {/* Abstract Background Element (Aali Style) */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#f25c54]/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full relative z-10"
            >
                <div className="flex items-center gap-4 mb-8">
                    <span className="w-12 h-[2px] bg-[#f25c54]"></span>
                    <span className="text-[#f25c54] text-sm md:text-base font-bold tracking-[0.2em] uppercase">Hello, I am</span>
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-[120px] font-bold mb-6 text-white leading-[0.9]" style={{ fontFamily: 'var(--font-heading)' }}>
                    <span className="text-[#f25c54] block mb-2">{data.name?.split(' ')[0] || 'Nombre'}</span>
                    {data.name?.split(' ').slice(1).join(' ') || 'Apellido'}
                </h1>

                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-2xl md:text-4xl text-slate-300 font-light mb-12 max-w-4xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {data.role || 'Describe el Cargo Principal'}
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col md:flex-row items-start md:items-center gap-8 mt-16"
                >
                    {data.phone && (
                        <a href={`tel:${data.phone}`} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-800 group-hover:border-[#f25c54] group-hover:bg-[#f25c54] transition-all duration-300">
                                <Phone size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-slate-300 group-hover:text-white font-medium text-sm tracking-wide">{data.phone}</span>
                        </a>
                    )}
                    {data.email && (
                        <a href={`mailto:${data.email}`} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-800 group-hover:border-[#f25c54] group-hover:bg-[#f25c54] transition-all duration-300">
                                <Mail size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-slate-300 group-hover:text-white font-medium text-sm tracking-wide">{data.email}</span>
                        </a>
                    )}
                </motion.div>

                {data.links && data.links.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="flex flex-wrap gap-4 mt-12 pt-12 border-t border-zinc-900"
                    >
                        {data.links.map((link: any, idx: number) => (
                            <a key={idx} href={link.url} target="_blank" className="px-6 py-3 bg-zinc-900 text-slate-400 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-medium text-xs tracking-widest uppercase flex items-center gap-2">
                                <LinkIcon size={14} /> {link.label}
                            </a>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </header>
    );
}

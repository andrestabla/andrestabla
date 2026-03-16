'use client';

import { motion } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';
import { safeHtml } from '@/lib/html';
import ResumeActions from '@/components/ResumeActions';

export default function HeroBlock({ data }: { data: any }) {
    const fullName = data.name || 'Nombre Apellido';
    const firstName = fullName.split(' ')[0] || 'Nombre';
    const lastName = fullName.split(' ').slice(1).join(' ') || 'Apellido';

    return (
        <header className="min-h-[90vh] flex flex-col justify-center items-start py-24 relative overflow-hidden bg-zinc-950 print:min-h-0 print:bg-transparent print:py-8">

            {/* Abstract Background Element (Aali Style) */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[var(--brand)]/10 rounded-full blur-[100px] -z-10 pointer-events-none print:hidden"></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full relative z-10"
            >
                <div className="flex items-center gap-4 mb-8">
                    <span className="w-12 h-[2px] bg-[var(--brand)]"></span>
                    <span
                        className="text-[var(--brand)] text-sm md:text-base font-bold tracking-[0.2em] uppercase"
                        dangerouslySetInnerHTML={safeHtml(data.greeting, 'Hello, I am')}
                    />
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-[120px] font-bold mb-6 text-white leading-[0.9]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--heading)' }}>
                    <span className="text-[var(--brand)] block mb-2" dangerouslySetInnerHTML={safeHtml(firstName, 'Nombre')} />
                    <span dangerouslySetInnerHTML={safeHtml(lastName, 'Apellido')} />
                </h1>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="rich-html text-2xl md:text-4xl text-slate-300 font-light mb-4 max-w-4xl leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}
                    dangerouslySetInnerHTML={safeHtml(data.role, 'Describe el Cargo Principal')}
                />

                {data.tagline && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="rich-html text-lg text-slate-400 font-light mb-12 max-w-2xl italic"
                        dangerouslySetInnerHTML={safeHtml(data.tagline)}
                    />
                )}

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.58, duration: 0.8 }}
                >
                    <ResumeActions
                        fullName={fullName}
                        phone={data.phone}
                        email={data.email}
                    />
                </motion.div>

                {data.links && data.links.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="flex flex-wrap gap-4 mt-14 pt-12 border-t border-zinc-900"
                    >
                        {data.links.map((link: any, idx: number) => (
                            <a key={idx} href={link.url} target="_blank" className="block-link-btn px-6 py-3 rounded-full border transition-all duration-300 font-medium text-xs tracking-widest uppercase flex items-center gap-2">
                                <LinkIcon size={14} />
                                <span dangerouslySetInnerHTML={safeHtml(link.label, 'Link')} />
                            </a>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </header>
    );
}

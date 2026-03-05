'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalNav({ siteConfig }: { siteConfig?: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    let parsedStyles: any = null;
    if (siteConfig?.globalStyles) {
        try { parsedStyles = JSON.parse(siteConfig.globalStyles); } catch (_error) { }
    }
    const logoUrl = parsedStyles?.logoUrl;
    const navLinks: { label: string; href: string }[] = parsedStyles?.navLinks || [
        { label: 'Inicio', href: '#' },
        { label: 'Experiencia', href: '#experiencia' },
        { label: 'Educación', href: '#educacion' },
        { label: 'Cursos', href: '#cursos' },
    ];

    const resolveNavHref = (rawHref: string) => {
        const href = String(rawHref || '').trim() || '#';
        if (!href.startsWith('#')) return href;
        if (pathname === '/') return href;
        return href === '#' ? '/' : `/${href}`;
    };

    return (
        <>
            {/* Top Fixed Hamburger Button */}
            <div className={`fixed top-0 right-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-6xl mx-auto px-6 md:px-12 flex justify-between items-center">

                    <a href="/" className="z-50 flex items-center gap-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Site Logo" className="h-8 md:h-10 object-contain drop-shadow-md" />
                        ) : (
                            <div className="text-white font-bold tracking-[0.2em] uppercase text-xs">
                                {siteConfig?.title?.split(' ')[0] || 'A.'} <span className="text-[var(--brand)]">{siteConfig?.title?.split(' ').slice(1).join(' ') || 'Tabla'}</span>
                            </div>
                        )}
                    </a>

                    <button
                        onClick={toggleMenu}
                        className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex flex-col items-center justify-center gap-1.5 z-50 hover:border-[#f25c54] hover:bg-zinc-900 transition-all duration-300 group"
                    >
                        <span className={`block w-5 h-[2px] bg-slate-400 group-hover:bg-[#f25c54] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[4px]' : ''}`}></span>
                        <span className={`block w-5 h-[2px] bg-slate-400 group-hover:bg-[#f25c54] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[4px]' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Fullscreen Off-Canvas Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 bg-zinc-950 z-40 flex flex-col justify-center items-center"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f25c54]/5 rounded-full blur-[120px] -z-10"></div>

                        <nav className="flex flex-col items-center gap-8 md:gap-12">
                            {navLinks.map((item: { label: string; href: string }, idx: number) => (
                                <motion.a
                                    key={idx}
                                    href={resolveNavHref(item.href)}
                                    onClick={() => toggleMenu()}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                                    className="text-4xl md:text-6xl font-bold text-slate-500 hover:text-white hover:pl-4 transition-all duration-300 relative group"
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                    <span className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-[var(--brand)] text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">0{idx + 1}</span>
                                    {item.label}
                                </motion.a>
                            ))}

                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { safeHtml } from '@/lib/html';

export default function NavMenuBlock({ data, isEditor }: { data: any, isEditor?: boolean }) {
    const defaultMenu = [
        { label: 'Inicio', link: '#' },
        { label: 'Servicios', link: '#' },
        { label: 'Portafolio', link: '#' },
        { label: 'Acerca', link: '#' },
        { label: 'Contacto', link: '#contact', isButton: true }
    ];

    const items = data.items || defaultMenu;
    const style = data.style || 'horizontal'; // horizontal, vertical, hamburger
    const alignment = data.alignment || 'justify-center'; // justify-start, justify-center, justify-end
    const color = data.color || 'text-slate-600 dark:text-zinc-300';

    const [isOpen, setIsOpen] = useState(false);

    if (style === 'vertical') {
        return (
            <nav className="w-full p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <ul className="flex flex-col space-y-4">
                    {items.map((item: any, idx: number) => (
                        <li key={idx} className="border-b border-slate-100 dark:border-zinc-800/50 pb-4 last:border-0 last:pb-0">
                            {item.isButton ? (
                                <a href={item.link} className={`block w-full text-center py-3 px-6 bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all ${isEditor ? 'pointer-events-none' : ''}`}>
                                    <span dangerouslySetInnerHTML={safeHtml(item.label)} />
                                </a>
                            ) : (
                                <a href={item.link} className={`block font-bold text-sm uppercase tracking-widest ${color} hover:text-indigo-500 transition-colors ${isEditor ? 'pointer-events-none' : ''}`}>
                                    <span dangerouslySetInnerHTML={safeHtml(item.label)} />
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }

    if (style === 'hamburger') {
        return (
            <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full shadow-sm">
                <div className="font-heading font-black text-xl tracking-tight pl-4">Menú</div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-3 rounded-full transition-colors ${isOpen ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-white hover:bg-slate-200'}`}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-4">
                        <ul className="flex flex-col space-y-4">
                            {items.map((item: any, idx: number) => (
                                <li key={idx}>
                                    <a href={item.link} className={`block font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-white hover:text-indigo-500 transition-colors ${isEditor ? 'pointer-events-none' : ''}`}>
                                        <span dangerouslySetInnerHTML={safeHtml(item.label)} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    // Default Horizontal
    return (
        <nav className={`w-full py-4 flex ${alignment} flex-wrap gap-8 items-center bg-transparent`}>
            {items.map((item: any, idx: number) => (
                <div key={idx}>
                    {item.isButton ? (
                        <a href={item.link} className={`inline-block py-3 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all ${isEditor ? 'pointer-events-none' : ''}`}>
                            <span dangerouslySetInnerHTML={safeHtml(item.label)} />
                        </a>
                    ) : (
                        <a href={item.link} className={`inline-block font-bold text-xs uppercase tracking-widest ${color} hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors ${isEditor ? 'pointer-events-none' : ''}`}>
                            <span dangerouslySetInnerHTML={safeHtml(item.label)} />
                        </a>
                    )}
                </div>
            ))}
        </nav>
    );
}

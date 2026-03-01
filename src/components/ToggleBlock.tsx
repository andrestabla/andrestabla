'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ToggleBlock({ data }: { data: any }) {
    const items = data.items || [
        { title: '¿Qué es esto?', content: 'Una descripción detallada.' },
        { title: '¿Cómo funciona?', content: 'Con magia.' }
    ];

    // Toggles are independent, so we store an array/set of open indices
    const [openIndices, setOpenIndices] = useState<number[]>([]);

    const toggleIndex = (idx: number) => {
        if (openIndices.includes(idx)) {
            setOpenIndices(openIndices.filter(i => i !== idx));
        } else {
            setOpenIndices([...openIndices, idx]);
        }
    };

    return (
        <div className="w-full space-y-4">
            {items.map((item: any, idx: number) => {
                const isOpen = openIndices.includes(idx);
                return (
                    <div key={idx} className="w-full border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 transition-all shadow-sm hover:shadow-md">
                        <button
                            onClick={() => toggleIndex(idx)}
                            className="w-full flex items-center justify-between p-5 text-left bg-transparent"
                        >
                            <span className="font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-widest text-sm">{item.title}</span>
                            <div className={`p-1.5 rounded-full transition-colors ${isOpen ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'}`}>
                                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                            </div>
                        </button>

                        <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
                        >
                            <div className="p-5 pt-0 border-t border-slate-100 dark:border-zinc-800/50 text-slate-600 dark:text-zinc-400 prose dark:prose-invert">
                                <div dangerouslySetInnerHTML={{ __html: item.content }} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

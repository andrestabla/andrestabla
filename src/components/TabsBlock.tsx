'use client';

import React, { useState } from 'react';

export default function TabsBlock({ data }: { data: any }) {
    const items = data.items || [
        { label: 'Visión', content: 'Nuestra visión es...' },
        { label: 'Misión', content: 'La misión encomendada es...' }
    ];
    const style = data.style || 'underline'; // underline, pill, default
    const color = data.color || 'bg-indigo-500'; // for active pill / border

    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <div className="w-full">
            {/* Tab Headers */}
            <div className={`flex gap-2 mb-6 ${style === 'underline' ? 'border-b border-slate-200 dark:border-zinc-800' : ''}`}>
                {items.map((item: any, idx: number) => {
                    const isActive = activeIdx === idx;

                    let tabClasses = "px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ";

                    if (style === 'underline') {
                        tabClasses += isActive ? `border-b-2 text-indigo-500 border-indigo-500` : `text-slate-500 hover:text-indigo-400 border-b-2 border-transparent`;
                    } else if (style === 'pill') {
                        tabClasses += isActive ? `${color} text-white rounded-full shadow-md` : `text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full`;
                    } else {
                        // default box
                        tabClasses += isActive ? `bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 border-b-white dark:border-b-zinc-800 rounded-t-lg text-indigo-500 relative top-[1px]` : `text-slate-500 hover:text-indigo-400 border border-transparent`;
                    }

                    return (
                        <button key={idx} onClick={() => setActiveIdx(idx)} className={tabClasses}>
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className={`w-full prose dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 ${style === 'default' ? 'p-6 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-b-lg rounded-tr-lg -mt-[1px]' : ''}`}>
                <div dangerouslySetInnerHTML={{ __html: items[activeIdx]?.content || '' }} />
            </div>
        </div>
    );
}

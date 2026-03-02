'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { safeHtml } from '@/lib/html';

function CounterItem({ item }: { item: any }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTimestamp: number;
        const duration = 2000; // 2 seconds

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(easeProgress * item.value));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(item.value);
            }
        };

        window.requestAnimationFrame(step);
    }, [isInView, item.value]);

    return (
        <div ref={ref} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/50 rounded-2xl shadow-sm text-center transform transition-transform hover:-translate-y-1 hover:shadow-md">
            <h4 className="text-4xl md:text-5xl font-heading font-black text-indigo-500 mb-2">
                {count}{item.suffix}
            </h4>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-zinc-400" dangerouslySetInnerHTML={safeHtml(item.label)} />
        </div>
    );
}

export default function CounterBlock({ data }: { data: any }) {
    const items = data.items || [
        { label: 'Proyectos', value: 150, suffix: '+' },
        { label: 'Clientes', value: 45, suffix: '' },
        { label: 'Años', value: 10, suffix: '+' }
    ];

    // Auto columns based on items count up to 4
    const colsClass = items.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
        items.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            items.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                'grid-cols-2 md:grid-cols-4';

    return (
        <div className={`w-full grid ${colsClass} gap-4 md:gap-6`}>
            {items.map((item: any, idx: number) => (
                <CounterItem key={idx} item={item} />
            ))}
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { safeHtml } from '@/lib/html';

export default function HotspotsBlock({ data }: { data: any }) {
    const bgImage = data.bgImage || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop';

    // x and y are percentages 0-100
    const spots = data.spots || [
        { id: 1, x: 50, y: 50, title: 'Pantalla', desc: 'Monitor 4K Ultrawide' },
        { id: 2, x: 20, y: 80, title: 'Teclado', desc: 'Mecánico Custom' }
    ];

    const [activeSpot, setActiveSpot] = useState<number | null>(null);

    return (
        <div className="w-full relative rounded-3xl overflow-hidden shadow-xl aspect-video bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bgImage} alt="Hotspots Background" className="w-full h-full object-cover" />

            {spots.map((spot: any) => (
                <div
                    key={spot.id}
                    className="absolute"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <button
                        className="relative w-8 h-8 md:w-10 md:h-10 bg-indigo-500 rounded-full text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-10 group"
                        onMouseEnter={() => setActiveSpot(spot.id)}
                        onMouseLeave={() => setActiveSpot(null)}
                    >
                        <span className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-75"></span>
                        <Info size={16} className="relative z-10" />
                    </button>

                    {/* Tooltip */}
                    <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl z-20 transition-all duration-300 origin-top pointer-events-none ${activeSpot === spot.id ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                    >
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-zinc-900 border-t border-l border-slate-200 dark:border-zinc-800 rotate-45"></div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-1 relative z-10" dangerouslySetInnerHTML={safeHtml(spot.title)} />
                        <p className="text-xs text-slate-500 dark:text-zinc-400 relative z-10" dangerouslySetInnerHTML={safeHtml(spot.desc)} />
                    </div>
                </div>
            ))}
        </div>
    );
}

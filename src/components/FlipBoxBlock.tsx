'use client';

import React, { useState } from 'react';

export default function FlipBoxBlock({ data }: { data: any }) {
    const frontIcon = data.frontIcon || '🚀';
    const frontTitle = data.frontTitle || 'Lanzamiento';
    const frontDesc = data.frontDesc || 'Hover o tap para ver más detalles.';
    const frontBgColor = data.frontBgColor || 'bg-slate-50 dark:bg-zinc-800';

    const backTitle = data.backTitle || 'Detalles';
    const backDesc = data.backDesc || 'Aquí puedes explicar a profundidad el servicio que ofreces o la característica técnica.';
    const backBgColor = data.backBgColor || 'bg-indigo-500 text-white';

    const height = data.height || 'h-80';
    const direction = data.direction || 'horizontal'; // horizontal, vertical

    const [isFlipped, setIsFlipped] = useState(false);

    // CSS 3D transform logic
    const flipTransform = direction === 'horizontal'
        ? (isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')
        : (isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)');

    const backFlipTransform = direction === 'horizontal'
        ? 'rotateY(180deg)'
        : 'rotateX(180deg)';

    return (
        <div
            className={`w-full border-none w-full max-w-sm mx-auto ${height} perspective-1000 group cursor-pointer`}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className="relative w-full h-full transition-transform duration-700 preserve-3d"
                style={{ transform: flipTransform }}
            >
                {/* FRONT FACE */}
                <div className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm ${frontBgColor}`}>
                    <div className="text-6xl mb-6">{frontIcon}</div>
                    <h3 className="text-2xl font-black mb-2 text-slate-800 dark:text-white title-font">{frontTitle}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{frontDesc}</p>
                </div>

                {/* BACK FACE */}
                <div
                    className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center rounded-3xl shadow-xl ${backBgColor}`}
                    style={{ transform: backFlipTransform }}
                >
                    <h3 className="text-2xl font-black mb-4 title-font text-white">{backTitle}</h3>
                    <p className="text-sm font-medium text-white/90">{backDesc}</p>
                    {data.buttonText && (
                        <a href={data.buttonLink || '#'} className="mt-6 px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors backdrop-blur-sm">
                            {data.buttonText}
                        </a>
                    )}
                </div>
            </div>

            {/* Global Styles for 3D Flips if missing in tailwind default */}
            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </div>
    );
}

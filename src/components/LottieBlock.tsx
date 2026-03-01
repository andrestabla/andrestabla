'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LottieBlock({ data, isEditor }: { data: any, isEditor?: boolean }) {
    const jsonUrl = data.jsonUrl || 'https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json'; // fallback generic animation
    const height = data.height || 'h-64';
    const loop = data.loop !== undefined ? data.loop : true;

    const [animData, setAnimData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!jsonUrl) return;
        setError(false);
        fetch(jsonUrl)
            .then(r => r.json())
            .then(data => setAnimData(data))
            .catch(() => setError(true));
    }, [jsonUrl]);

    return (
        <div className={`w-full ${height} flex flex-col items-center justify-center relative`}>
            {isEditor && (
                <div className="absolute inset-0 z-10" title="Capa de editor para evitar intercepciones"></div>
            )}

            {error ? (
                <div className="text-xs text-red-400 font-mono bg-red-500/10 p-4 rounded-xl">Error cargando JSON animado de {jsonUrl}</div>
            ) : animData ? (
                <Lottie animationData={animData} loop={loop} className="w-full h-full" />
            ) : (
                <div className="text-xs text-slate-400 uppercase tracking-widest animate-pulse">Cargando Animación...</div>
            )}
        </div>
    );
}

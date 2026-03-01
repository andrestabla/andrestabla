'use client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SiteLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Minimum load time for effect
        const timer1 = setTimeout(() => setIsFading(true), 800);
        const timer2 = setTimeout(() => setIsLoading(false), 1200);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="text-white animate-spin opacity-50" />
                <span className="text-xs tracking-widest uppercase font-bold text-white/50">Cargando Experiencia</span>
            </div>
        </div>
    );
}

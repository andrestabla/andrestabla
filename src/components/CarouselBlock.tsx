'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { safeHtml } from '@/lib/html';

export default function CarouselBlock({ data }: { data: any }) {
    const images = data.images || [];
    const height = data.height || 'h-[400px]';
    const autoPlay = data.autoPlay !== false; // default true

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [autoPlay, images.length]);

    if (images.length === 0) return <div className={`w-full ${height} bg-slate-900 rounded-xl flex items-center justify-center text-slate-500`}>Añade imágenes al Carrusel</div>;

    const goToPrev = () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const goToNext = () => setCurrentIndex(prev => (prev + 1) % images.length);

    return (
        <div className={`w-full ${height} relative rounded-xl overflow-hidden shadow-2xl group`}>
            {images.map((img: any, i: number) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img src={img.url} alt={`Slide ${i}`} className="w-full h-full object-cover" />
                    {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                            <p className="text-white font-medium text-lg" dangerouslySetInnerHTML={safeHtml(img.caption)} />
                        </div>
                    )}
                </div>
            ))}

            {images.length > 1 && (
                <>
                    <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {images.map((_: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

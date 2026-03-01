import React from 'react';

export default function GalleryBlock({ data }: { data: any }) {
    const images = data.images || [
        { url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop', alt: 'Código' },
        { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop', alt: 'Setup' },
        { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop', alt: 'Dev' },
    ];
    const columns = data.columns || 'grid-cols-2 md:grid-cols-3';
    const gap = data.gap || 'gap-4';

    return (
        <div className={`w-full grid ${columns} ${gap}`}>
            {images.map((img: any, idx: number) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={img.url}
                        alt={img.alt || `Gallery Image ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 filter hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-bold text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.alt}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

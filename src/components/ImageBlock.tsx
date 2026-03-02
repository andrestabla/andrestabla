import React from 'react';
import { safeHtml } from '@/lib/html';

export default function ImageBlock({ data }: { data: any }) {
    const imageUrl = data.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
    const altText = data.alt || 'Imagen referencial';
    const objectFit = data.objectFit || 'object-cover';
    const radius = data.borderRadius || 'rounded-xl';
    const height = data.height || 'h-[400px]';

    return (
        <div className={`w-full ${height} overflow-hidden shadow-xl ${radius} relative group`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imageUrl}
                alt={altText}
                className={`w-full h-full ${objectFit} transition-transform duration-700 group-hover:scale-105`}
            />

            {data.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                    <p className="text-white text-sm font-medium" dangerouslySetInnerHTML={safeHtml(data.caption)} />
                </div>
            )}
        </div>
    );
}

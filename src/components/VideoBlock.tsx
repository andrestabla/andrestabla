import React from 'react';

export default function VideoBlock({ data }: { data: any }) {
    const videoUrl = data.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    const aspectRatio = data.aspectRatio || 'aspect-video';
    const radius = data.borderRadius || 'rounded-xl';

    // Format youtube URLs to embed if necessary
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
        embedUrl = videoUrl.replace('watch?v=', 'embed/');
    }

    return (
        <div className={`w-full overflow-hidden shadow-2xl ${aspectRatio} ${radius}`}>
            {embedUrl ? (
                <iframe
                    src={embedUrl}
                    title="Video player"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                    URL de Video Inválida
                </div>
            )}
        </div>
    );
}

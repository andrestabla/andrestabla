'use client';

import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { resolveBackgroundVideo } from '@/lib/backgroundVideo';

export default function BlockBackgroundVideo({ url, fullBleed = false }: { url?: string; fullBleed?: boolean }) {
    const media = useMemo(() => resolveBackgroundVideo(String(url || '')), [url]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [iframeStyle, setIframeStyle] = useState<CSSProperties>({
        width: 'max(100%, 177.7778vh)',
        height: 'max(100%, 56.25vw)',
        transform: 'translate(-50%, -50%)',
    });

    useEffect(() => {
        if (!media || media.kind === 'file') return;
        const target = containerRef.current;
        if (!target) return;

        const VIDEO_RATIO = 16 / 9;
        const OVERSCAN = 1.02;

        const updateFrame = () => {
            const rect = target.getBoundingClientRect();
            const width = Math.max(1, rect.width);
            const height = Math.max(1, rect.height);
            const containerRatio = width / height;

            let frameWidth = width;
            let frameHeight = height;

            if (containerRatio > VIDEO_RATIO) {
                frameWidth = width * OVERSCAN;
                frameHeight = (width / VIDEO_RATIO) * OVERSCAN;
            } else {
                frameHeight = height * OVERSCAN;
                frameWidth = (height * VIDEO_RATIO) * OVERSCAN;
            }

            setIframeStyle({
                width: `${frameWidth}px`,
                height: `${frameHeight}px`,
                transform: 'translate(-50%, -50%)',
            });
        };

        updateFrame();
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateFrame) : null;
        observer?.observe(target);
        window.addEventListener('resize', updateFrame);
        window.addEventListener('orientationchange', updateFrame);

        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', updateFrame);
            window.removeEventListener('orientationchange', updateFrame);
        };
    }, [media]);

    if (!media) return null;

    const containerClass = fullBleed
        ? 'block-bg-video block-bg-fullbleed absolute inset-0 z-0 overflow-hidden pointer-events-none'
        : 'block-bg-video absolute inset-0 z-0 overflow-hidden pointer-events-none';

    return (
        <div
            ref={containerRef}
            className={containerClass}
            aria-hidden="true"
            data-no-auto-translate="true"
        >
            {media.kind === 'file' ? (
                <video
                    className="block-bg-video-file absolute inset-0 h-full w-full object-cover"
                    src={media.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />
            ) : (
                <iframe
                    src={media.embedUrl}
                    title="Background video"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block-bg-video-iframe pointer-events-none absolute left-1/2 top-1/2 border-0"
                    style={iframeStyle}
                    allow="autoplay; fullscreen; picture-in-picture"
                />
            )}
        </div>
    );
}

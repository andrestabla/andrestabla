import { resolveBackgroundVideo } from '@/lib/backgroundVideo';

export default function BlockBackgroundVideo({ url }: { url?: string }) {
    const media = resolveBackgroundVideo(String(url || ''));
    if (!media) return null;

    return (
        <div
            className="block-bg-video absolute inset-0 z-0 overflow-hidden pointer-events-none"
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
                    style={{
                        width: 'max(100%, 177.7778vh)',
                        height: 'max(100%, 56.25vw)',
                        transform: 'translate(-50%, -50%)',
                    }}
                    allow="autoplay; fullscreen; picture-in-picture"
                />
            )}
        </div>
    );
}

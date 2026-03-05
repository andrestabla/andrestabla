export type BackgroundVideoConfig =
    | { kind: 'file'; src: string }
    | { kind: 'youtube'; embedUrl: string }
    | { kind: 'vimeo'; embedUrl: string };

export type BackgroundMediaType = 'auto' | 'image' | 'video';

type BackgroundStyleInput = {
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundMediaType?: string;
};

function normalizeInput(rawValue: string): string {
    const value = String(rawValue || '').trim();
    if (!value) return '';
    if (value.startsWith('www.')) return `https://${value}`;
    return value;
}

function safeUrl(value: string): URL | null {
    try {
        const parsed = new URL(value);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
        return parsed;
    } catch (_error) {
        return null;
    }
}

function extractYouTubeId(url: URL): string | null {
    const host = url.hostname.toLowerCase();
    const path = url.pathname;

    if (host === 'youtu.be') {
        const candidate = path.replace(/^\//, '').split('/')[0];
        return candidate || null;
    }

    if (host.includes('youtube.com')) {
        const fromQuery = url.searchParams.get('v');
        if (fromQuery) return fromQuery;

        const segments = path.split('/').filter(Boolean);
        if (segments.length >= 2 && (segments[0] === 'embed' || segments[0] === 'shorts')) {
            return segments[1];
        }
    }

    return null;
}

function extractVimeoId(url: URL): string | null {
    const host = url.hostname.toLowerCase();
    if (!host.includes('vimeo.com')) return null;

    const segments = url.pathname.split('/').filter(Boolean);
    for (let idx = segments.length - 1; idx >= 0; idx -= 1) {
        const segment = segments[idx];
        if (/^\d{5,15}$/.test(segment)) {
            return segment;
        }
    }

    return null;
}

function isLikelyDirectVideo(url: URL): boolean {
    const pathname = url.pathname.toLowerCase();
    return /\.(mp4|webm|ogg|m4v|mov|m3u8)(\?.*)?$/.test(pathname);
}

function normalizeValue(value: unknown): string {
    return String(value || '').trim();
}

export function normalizeBackgroundMediaType(value: unknown): BackgroundMediaType {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'image') return 'image';
    if (normalized === 'video') return 'video';
    return 'auto';
}

export function inferBackgroundMediaType(input: BackgroundStyleInput): Exclude<BackgroundMediaType, 'auto'> {
    const backgroundVideo = normalizeValue(input.backgroundVideo);
    if (backgroundVideo) return 'video';

    const backgroundImage = normalizeValue(input.backgroundImage);
    if (backgroundImage && resolveBackgroundVideo(backgroundImage)) return 'video';

    return 'image';
}

export function resolveBackgroundMediaUrls(input: BackgroundStyleInput): { imageUrl: string; videoUrl: string } {
    const backgroundImage = normalizeValue(input.backgroundImage);
    const backgroundVideo = normalizeValue(input.backgroundVideo);
    const mediaType = normalizeBackgroundMediaType(input.backgroundMediaType);

    if (mediaType === 'image') {
        return { imageUrl: backgroundImage, videoUrl: '' };
    }

    if (mediaType === 'video') {
        return { imageUrl: '', videoUrl: backgroundVideo || backgroundImage };
    }

    const autoVideoSource = backgroundVideo || backgroundImage;
    if (autoVideoSource && resolveBackgroundVideo(autoVideoSource)) {
        return { imageUrl: '', videoUrl: autoVideoSource };
    }

    return { imageUrl: backgroundImage, videoUrl: '' };
}

export function resolveBackgroundVideo(rawValue: string): BackgroundVideoConfig | null {
    const input = normalizeInput(rawValue);
    if (!input) return null;

    if (input.startsWith('/')) {
        return { kind: 'file', src: input };
    }

    const url = safeUrl(input);
    if (!url) return null;

    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
        const embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(youtubeId)}&controls=0&modestbranding=1&rel=0&playsinline=1`;
        return { kind: 'youtube', embedUrl };
    }

    const vimeoId = extractVimeoId(url);
    if (vimeoId) {
        const embedUrl = `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`;
        return { kind: 'vimeo', embedUrl };
    }

    if (isLikelyDirectVideo(url)) {
        return { kind: 'file', src: url.toString() };
    }

    return null;
}

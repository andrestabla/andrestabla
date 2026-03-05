export type ResolvedEmbed = {
    provider: string;
    embedUrl: string | null;
    normalizedUrl: string;
    note?: string;
};

function normalizeUrl(rawUrl: string): string {
    const trimmed = (rawUrl || '').trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

function extractYouTubeId(url: URL): string {
    if (url.hostname.includes('youtu.be')) {
        const id = url.pathname.split('/').filter(Boolean)[0];
        return id || '';
    }

    const watchId = url.searchParams.get('v');
    if (watchId) return watchId;

    const parts = url.pathname.split('/').filter(Boolean);
    const embedIndex = parts.findIndex((part) => part === 'embed' || part === 'shorts');
    if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1];
    return '';
}

function extractVimeoId(pathname: string): string {
    const parts = pathname.split('/').filter(Boolean);
    const id = parts.reverse().find((part) => /^\d+$/.test(part));
    return id || '';
}

export function resolveEmbedFromUrl(inputUrl: string): ResolvedEmbed {
    const normalizedUrl = normalizeUrl(inputUrl);
    if (!normalizedUrl) {
        return { provider: 'unknown', embedUrl: null, normalizedUrl: '' };
    }

    let url: URL;
    try {
        url = new URL(normalizedUrl);
    } catch (_error) {
        return { provider: 'invalid', embedUrl: null, normalizedUrl };
    }

    const host = url.hostname.toLowerCase();
    const cleanHost = host.startsWith('www.') ? host.slice(4) : host;
    const path = url.pathname;

    if (cleanHost.includes('youtube.com') || cleanHost.includes('youtu.be')) {
        const id = extractYouTubeId(url);
        if (!id) return { provider: 'youtube', embedUrl: null, normalizedUrl };
        return { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}`, normalizedUrl };
    }

    if (cleanHost.includes('vimeo.com')) {
        const id = extractVimeoId(path);
        if (!id) return { provider: 'vimeo', embedUrl: null, normalizedUrl };
        return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}`, normalizedUrl };
    }

    if (cleanHost.includes('loom.com')) {
        const parts = path.split('/').filter(Boolean);
        const shareIndex = parts.findIndex((part) => part === 'share');
        const embedIndex = parts.findIndex((part) => part === 'embed');
        const id = shareIndex >= 0 ? parts[shareIndex + 1] : embedIndex >= 0 ? parts[embedIndex + 1] : '';
        if (!id) return { provider: 'loom', embedUrl: null, normalizedUrl };
        return { provider: 'loom', embedUrl: `https://www.loom.com/embed/${id}`, normalizedUrl };
    }

    if (cleanHost === 'open.spotify.com') {
        const parts = path.split('/').filter(Boolean);
        const type = parts[0];
        const id = parts[1];
        if (!type || !id) return { provider: 'spotify', embedUrl: null, normalizedUrl };
        return { provider: 'spotify', embedUrl: `https://open.spotify.com/embed/${type}/${id}`, normalizedUrl };
    }

    if (cleanHost.endsWith('figma.com')) {
        return {
            provider: 'figma',
            embedUrl: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(normalizedUrl)}`,
            normalizedUrl,
        };
    }

    if (cleanHost === 'drive.google.com') {
        const parts = path.split('/').filter(Boolean);
        const fileIndex = parts.findIndex((part) => part === 'file');
        if (fileIndex >= 0 && parts[fileIndex + 2]) {
            return {
                provider: 'google-drive',
                embedUrl: `https://drive.google.com/file/d/${parts[fileIndex + 2]}/preview`,
                normalizedUrl,
            };
        }
    }

    if (cleanHost === 'docs.google.com') {
        const parts = path.split('/').filter(Boolean);
        if (parts[0] === 'document' && parts[2]) {
            return {
                provider: 'google-docs',
                embedUrl: `https://docs.google.com/document/d/${parts[2]}/preview`,
                normalizedUrl,
            };
        }
        if (parts[0] === 'presentation' && parts[2]) {
            return {
                provider: 'google-slides',
                embedUrl: `https://docs.google.com/presentation/d/${parts[2]}/embed?start=false&loop=false&delayms=3000`,
                normalizedUrl,
            };
        }
        if (parts[0] === 'spreadsheets' && parts[2]) {
            return {
                provider: 'google-sheets',
                embedUrl: `https://docs.google.com/spreadsheets/d/${parts[2]}/preview`,
                normalizedUrl,
            };
        }
    }

    // Fallback: try direct iframe URL, but some sites may block framing.
    return {
        provider: 'web',
        embedUrl: normalizedUrl,
        normalizedUrl,
        note: 'Algunos sitios externos bloquean la visualización embebida (X-Frame-Options).',
    };
}

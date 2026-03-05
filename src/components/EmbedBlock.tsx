import React from 'react';
import { ExternalLink } from 'lucide-react';
import { resolveEmbedFromUrl } from '@/lib/embed';

export default function EmbedBlock({ data, isEditor }: { data: any; isEditor?: boolean }) {
    const sourceUrl = (data.url || '').trim();
    const aspectRatio = data.aspectRatio || 'aspect-video';
    const borderRadius = data.borderRadius || 'rounded-xl';
    const title = data.title || 'Contenido embebido';
    const customHeight = data.height || 'h-[420px]';
    const useCustomHeight = aspectRatio === 'custom';

    const resolved = resolveEmbedFromUrl(sourceUrl);
    const embedUrl = resolved.embedUrl;
    const fallbackHref = resolved.normalizedUrl || sourceUrl;

    if (!sourceUrl) {
        return (
            <div className="w-full rounded-xl border border-dashed border-slate-500/40 bg-zinc-900/40 p-6 text-center text-sm text-slate-400">
                Pega una URL en el inspector para insertar un embed.
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className={`relative w-full overflow-hidden shadow-2xl bg-zinc-900 ${borderRadius} ${useCustomHeight ? customHeight : aspectRatio}`}>
                {embedUrl ? (
                    <>
                        {isEditor && <div className="absolute inset-0 z-10" />}
                        <iframe
                            src={embedUrl}
                            title={title}
                            className="w-full h-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </>
                ) : (
                    <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center text-center px-6">
                        <p className="text-sm text-slate-300 mb-3">No se pudo generar un embed válido para esta URL.</p>
                        {fallbackHref && (
                            <a
                                href={fallbackHref}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300"
                            >
                                Abrir enlace <ExternalLink size={13} />
                            </a>
                        )}
                    </div>
                )}
            </div>

            {resolved.note && (
                <p className="mt-2 text-[11px] text-slate-500">
                    {resolved.note}
                </p>
            )}
        </div>
    );
}

'use client';

import { useMemo, useState } from 'react';
import { resolveEmbedFromUrl } from '@/lib/embed';

export default function EmbedInspector({
    initialData,
    onSave,
    isSaving,
}: {
    initialData: any;
    onSave: (data: any) => void;
    isSaving: boolean;
}) {
    const [url, setUrl] = useState(initialData.url || '');
    const [title, setTitle] = useState(initialData.title || 'Contenido embebido');
    const [aspectRatio, setAspectRatio] = useState(initialData.aspectRatio || 'aspect-video');
    const [borderRadius, setBorderRadius] = useState(initialData.borderRadius || 'rounded-xl');
    const [height, setHeight] = useState(initialData.height || 'h-[420px]');

    const resolved = useMemo(() => resolveEmbedFromUrl(url), [url]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ url: url.trim(), title, aspectRatio, borderRadius, height });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">
                        URL a embebir
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                        Soporta YouTube, Vimeo, Loom, Spotify, Figma, Google Docs/Drive y enlaces web embebibles.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Formato</label>
                        <select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white"
                        >
                            <option value="aspect-video">16:9 Panorámico</option>
                            <option value="aspect-square">1:1 Cuadrado</option>
                            <option value="aspect-[4/5]">4:5 Vertical</option>
                            <option value="custom">Altura personalizada</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Bordes</label>
                        <select
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(e.target.value)}
                            className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white"
                        >
                            <option value="rounded-none">Rectos</option>
                            <option value="rounded-xl">Suaves</option>
                            <option value="rounded-2xl">Redondeados</option>
                            <option value="rounded-3xl">Muy redondeados</option>
                        </select>
                    </div>
                </div>

                {aspectRatio === 'custom' && (
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Clase de altura</label>
                        <input
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="h-[480px]"
                            className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                )}

                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Título Accesible</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Contenido embebido"
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">Proveedor detectado</p>
                <p className="text-xs text-indigo-700">
                    {resolved.provider.toUpperCase()} {resolved.embedUrl ? '• URL embebida lista' : '• URL pendiente o inválida'}
                </p>
                {resolved.note && <p className="text-[10px] text-indigo-600 mt-1">{resolved.note}</p>}
            </div>

            <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-black text-white p-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
                {isSaving ? 'Guardando...' : 'Actualizar Embed'}
            </button>
        </form>
    );
}

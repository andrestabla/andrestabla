import { useState } from 'react';

export default function VideoInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [url, setUrl] = useState(initialData.url || '');
    const [aspectRatio, setAspectRatio] = useState(initialData.aspectRatio || 'aspect-video');
    const [borderRadius, setBorderRadius] = useState(initialData.borderRadius || 'rounded-xl');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ url, aspectRatio, borderRadius });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">URL de YouTube / Vimeo / MP4</label>
                <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Formato</label>
                        <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white">
                            <option value="aspect-video">16:9 Panorámico</option>
                            <option value="aspect-square">1:1 Cuadrado</option>
                            <option value="aspect-[9/16]">9:16 Vertical (Reels)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Bordes</label>
                        <select value={borderRadius} onChange={e => setBorderRadius(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white">
                            <option value="rounded-none">Rectos (None)</option>
                            <option value="rounded-xl">Suaves (XL)</option>
                            <option value="rounded-3xl">Redondos (3XL)</option>
                        </select>
                    </div>
                </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-colors">
                {isSaving ? 'Guardando...' : 'Actualizar Video'}
            </button>
        </form>
    );
}

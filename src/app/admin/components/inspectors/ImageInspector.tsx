import { useState } from 'react';

export default function ImageInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [url, setUrl] = useState(initialData.url || '');
    const [alt, setAlt] = useState(initialData.alt || '');
    const [caption, setCaption] = useState(initialData.caption || '');
    const [height, setHeight] = useState(initialData.height || 'h-[400px]');
    const [objectFit, setObjectFit] = useState(initialData.objectFit || 'object-cover');
    const [borderRadius, setBorderRadius] = useState(initialData.borderRadius || 'rounded-xl');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ url, alt, caption, height, objectFit, borderRadius });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">

                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">URL de la Imagen (Hosting externo)</label>
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Texto Alternativo (SEO)</label>
                        <input type="text" value={alt} onChange={e => setAlt(e.target.value)} placeholder="Ej: Retrato en oficina" className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Pie de Foto (Opcional)</label>
                        <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Tomado en 2024..." className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Altura</label>
                        <select value={height} onChange={e => setHeight(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white">
                            <option value="h-auto">Auto</option>
                            <option value="h-[250px]">Mediana (250px)</option>
                            <option value="h-[400px]">Estándar (400px)</option>
                            <option value="h-[600px]">Alta (600px)</option>
                            <option value="h-screen">Pantalla Completa</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Ajuste</label>
                        <select value={objectFit} onChange={e => setObjectFit(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white">
                            <option value="object-cover">Cubrir (Cover)</option>
                            <option value="object-contain">Contener (Contain)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Bordes</label>
                        <select value={borderRadius} onChange={e => setBorderRadius(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white">
                            <option value="rounded-none">Rectos</option>
                            <option value="rounded-xl">XL</option>
                            <option value="rounded-full">Círculo</option>
                        </select>
                    </div>
                </div>

            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-colors">
                {isSaving ? 'Guardando...' : 'Actualizar Imagen'}
            </button>
        </form>
    );
}

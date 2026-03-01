'use client';

import { useState } from 'react';

export default function MapInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [embedUrl, setEmbedUrl] = useState(initialData.embedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3976.9254399767666!2d-74.06527502422709!3d4.607386042456076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a093ed03af%3A0x67bb481498b89417!2sUniversidad%20de%20los%20Andes!5e0!3m2!1ses!2sco!4v1709400000000!5m2!1ses!2sco');
    const [height, setHeight] = useState(initialData.height || 'h-[400px]');
    const [borderRadius, setBorderRadius] = useState(initialData.borderRadius || 'rounded-2xl');

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Google Maps Embed URL</label>
                <textarea rows={4} value={embedUrl} onChange={e => setEmbedUrl(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono resize-none"></textarea>
                <p className="text-[9px] text-slate-400 mt-1">Pega aquí el enlace del iframe que te da Google Maps al darle Compartir {">"} Insertar Mapa.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Altura</label>
                    <input type="text" value={height} onChange={e => setHeight(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Ej: h-[400px]" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Bordes</label>
                    <select value={borderRadius} onChange={e => setBorderRadius(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="rounded-none">Cuadrado</option>
                        <option value="rounded-xl">Redondeado (XL)</option>
                        <option value="rounded-2xl">Redondeado (2XL)</option>
                        <option value="rounded-3xl">Redondeado (3XL)</option>
                    </select>
                </div>
            </div>

            <button onClick={() => onSave({ embedUrl, height, borderRadius })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

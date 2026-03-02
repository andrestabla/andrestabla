'use client';

import { useState } from 'react';
import RichTextField from './RichTextField';

export default function CallToActionInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [title, setTitle] = useState(initialData.title || '¿Listo para empezar tu proyecto?');
    const [subtitle, setSubtitle] = useState(initialData.subtitle || 'Hablemos sobre diseño y tecnología.');
    const [buttonText, setButtonText] = useState(initialData.buttonText || 'Agenda una llamada');
    const [buttonLink, setButtonLink] = useState(initialData.buttonLink || '#');
    const [bgImage, setBgImage] = useState(initialData.bgImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&q=80&w=1600&auto=format&fit=crop');
    const [style, setStyle] = useState(initialData.style || 'cover');

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Título Principal (H2)</label>
                <RichTextField
                    value={title}
                    onChange={setTitle}
                    minHeightClass="min-h-[44px]"
                    singleLine
                />
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Subtítulo / Bajada</label>
                <RichTextField
                    value={subtitle}
                    onChange={setSubtitle}
                    minHeightClass="min-h-[72px]"
                />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Botón de Llamado a la Acción</label>
                <div className="grid grid-cols-2 gap-2">
                    <RichTextField
                        value={buttonText}
                        onChange={setButtonText}
                        placeholder="Texto (ej: Comprar)"
                        minHeightClass="min-h-[40px]"
                        singleLine
                    />
                    <input type="text" value={buttonLink} onChange={e => setButtonLink(e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs font-mono" placeholder="Enlace (URL)" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Imagen de Fondo (URL)</label>
                <input type="text" value={bgImage} onChange={e => setBgImage(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono" placeholder="https://..." />
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Variación Estilística</label>
                <select value={style} onChange={e => setStyle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                    <option value="cover">Fondo Completo (Cover)</option>
                    <option value="split">Dividido 50/50 (Elegante)</option>
                    <option value="banner">Banner Simple (Horizontal)</option>
                </select>
            </div>

            <button onClick={() => onSave({ title, subtitle, buttonText, buttonLink, bgImage, style })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-2 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

'use client';

import { useState } from 'react';

export default function ButtonInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [text, setText] = useState(initialData.text || 'Haz clic aquí');
    const [link, setLink] = useState(initialData.link || '#');
    const [openInNewTab, setOpenInNewTab] = useState(Boolean(initialData.openInNewTab));
    const [style, setStyle] = useState(initialData.style || 'primary');
    const [size, setSize] = useState(initialData.size || 'md');
    const [align, setAlign] = useState(initialData.align || 'text-left');

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Etiqueta</label>
                <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ruta (URL)</label>
                <input type="text" value={link} onChange={e => setLink(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" placeholder="https://..." />
            </div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">
                <input
                    type="checkbox"
                    checked={openInNewTab}
                    onChange={e => setOpenInNewTab(e.target.checked)}
                    className="rounded border-slate-300"
                />
                Abrir en nueva pestaña
            </label>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Apariencia</label>
                    <select value={style} onChange={e => setStyle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="primary">Primario (Lleno)</option>
                        <option value="secondary">Secundario (Oscuro)</option>
                        <option value="outline">Delineado (Bordes)</option>
                        <option value="ghost">Fantasma (Sin fondo)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tamaño</label>
                    <select value={size} onChange={e => setSize(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="sm">Pequeño</option>
                        <option value="md">Mediano</option>
                        <option value="lg">Grande</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Posición</label>
                <select value={align} onChange={e => setAlign(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                    <option value="text-left">Izquierda</option>
                    <option value="text-center">Centro</option>
                    <option value="text-right">Derecha</option>
                </select>
            </div>
            <button
                onClick={() => onSave({ text, link, openInNewTab, style, size, align })}
                disabled={isSaving}
                className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4"
            >
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

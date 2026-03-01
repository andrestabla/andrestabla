'use client';

import { useState } from 'react';

export default function HeadingInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [text, setText] = useState(initialData.text || 'Nuevo Encabezado');
    const [tag, setTag] = useState(initialData.tag || 'h2');
    const [align, setAlign] = useState(initialData.align || 'text-left');
    const [color, setColor] = useState(initialData.color || 'text-slate-900');

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Texto</label>
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nivel HTML</label>
                <select value={tag} onChange={e => setTag(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                    <option value="h1">Título Gigante (H1)</option>
                    <option value="h2">Estructura Principal (H2)</option>
                    <option value="h3">Subtítulo (H3)</option>
                    <option value="h4">Sección Pequeña (H4)</option>
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Alineación</label>
                <select value={align} onChange={e => setAlign(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                    <option value="text-left">Izquierda</option>
                    <option value="text-center">Centro</option>
                    <option value="text-right">Derecha</option>
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Color (Clase Tailwind)</label>
                <input
                    type="text"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                    placeholder="text-slate-900"
                />
            </div>
            <button
                onClick={() => onSave({ text, tag, align, color })}
                disabled={isSaving}
                className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4"
            >
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

'use client';

import { useState } from 'react';

export default function SpacerInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [height, setHeight] = useState(initialData.height || 'h-12');

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tamaño Vertical</label>
                <select value={height} onChange={e => setHeight(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                    <option value="h-4">Minúsculo (1rem)</option>
                    <option value="h-8">Pequeño (2rem)</option>
                    <option value="h-12">Normal (3rem)</option>
                    <option value="h-24">Grande (6rem)</option>
                    <option value="h-32">Enorme (8rem)</option>
                    <option value="h-48">Catártico (12rem)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-2">Esta caja es invisible para los usuarios interrumpe el flujo vertical dando respiro a los contenidos visuales adyacentes.</p>
            </div>
            <button onClick={() => onSave({ height })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

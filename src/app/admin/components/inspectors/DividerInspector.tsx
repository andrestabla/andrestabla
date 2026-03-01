'use client';

import { useState } from 'react';

export default function DividerInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [style, setStyle] = useState(initialData.style || 'solid');
    const [thickness, setThickness] = useState(initialData.thickness || 'border-t');
    const [color, setColor] = useState(initialData.color || 'border-slate-200');
    const [width, setWidth] = useState(initialData.width || 'w-full');

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Estilo de Línea</label>
                    <select value={style} onChange={e => setStyle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="solid">Sólida (Solid)</option>
                        <option value="dashed">Punteada (Dashed)</option>
                        <option value="dotted">Puntos (Dotted)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Grosor</label>
                    <select value={thickness} onChange={e => setThickness(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="border-t">Fino (1px)</option>
                        <option value="border-t-2">Medio (2px)</option>
                        <option value="border-t-4">Grueso (4px)</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ancho en Contenedor</label>
                <select value={width} onChange={e => setWidth(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                    <option value="w-full">Ancho Completo (100%)</option>
                    <option value="w-1/2">Mitad (50%)</option>
                    <option value="w-1/4">Cuarto (25%)</option>
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Color del Borde (Tailwind)</label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" placeholder="border-slate-200" />
            </div>
            <button onClick={() => onSave({ style, thickness, color, width })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

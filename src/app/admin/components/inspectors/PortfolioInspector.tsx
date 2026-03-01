'use client';

import { useState } from 'react';

export default function PortfolioInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    // Basic settings to demonstrate Layout controls
    const [columns, setColumns] = useState(initialData.columns || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
    const [gap, setGap] = useState(initialData.gap || 'gap-4');

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl mb-2">
                <p className="text-[10px] text-slate-500 font-medium">Renderiza proyectos fijos con un Filter Bar (`Todos`, `Web`, `Diseño`, etc.) integrado. Los datos actualmente son de demostración interactiva.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Columnas</label>
                    <select value={columns} onChange={e => setColumns(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white">
                        <option value="grid-cols-1 md:grid-cols-2">2 (Tablet+)</option>
                        <option value="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">3 (Desktop)</option>
                        <option value="grid-cols-2 md:grid-cols-3 lg:grid-cols-4">4 (Wide)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Espaciado Interno</label>
                    <select value={gap} onChange={e => setGap(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white">
                        <option value="gap-0">Sin Espacio (Collage)</option>
                        <option value="gap-4">Normal</option>
                        <option value="gap-8">Separado</option>
                    </select>
                </div>
            </div>

            <button onClick={() => onSave({ columns, gap })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-4 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

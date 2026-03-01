'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function HotspotsInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [bgImage, setBgImage] = useState(initialData.bgImage || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop');

    // x and y are percentages 0-100
    const [spots, setSpots] = useState<any[]>(initialData.spots || [
        { id: 1, x: 50, y: 50, title: 'Centro', desc: 'Descripción del punto' }
    ]);

    const handleSpotChange = (index: number, field: string, value: any) => {
        const ns = [...spots];
        ns[index][field] = value;
        setSpots(ns);
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Imagen de Fondo (URL)</label>
                <input type="text" value={bgImage} onChange={e => setBgImage(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono" placeholder="https://..." />
            </div>

            <div className="border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Marcadores Interactivos (Pines)</label>
                <div className="space-y-4">
                    {spots.map((spot, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg relative">
                            <button onClick={() => setSpots(spots.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1">
                                <Trash2 size={14} />
                            </button>

                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Posición X (%)</label>
                                    <input type="number" value={spot.x} onChange={e => handleSpotChange(idx, 'x', parseInt(e.target.value))} className="w-full border border-slate-200 rounded-md p-2 text-xs" min={0} max={100} />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Posición Y (%)</label>
                                    <input type="number" value={spot.y} onChange={e => handleSpotChange(idx, 'y', parseInt(e.target.value))} className="w-full border border-slate-200 rounded-md p-2 text-xs" min={0} max={100} />
                                </div>
                            </div>

                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Título del Hover</label>
                            <input type="text" value={spot.title} onChange={e => handleSpotChange(idx, 'title', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs font-bold mb-2" />

                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Descripción Larga</label>
                            <textarea rows={2} value={spot.desc} onChange={e => handleSpotChange(idx, 'desc', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs resize-none"></textarea>
                        </div>
                    ))}
                </div>
                <button onClick={() => setSpots([...spots, { id: Date.now(), x: 50, y: 50, title: 'Nuevo Pin', desc: '' }])} className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                    <Plus size={14} /> Añadir Marcador
                </button>
            </div>

            <button onClick={() => onSave({ bgImage, spots })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-2 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

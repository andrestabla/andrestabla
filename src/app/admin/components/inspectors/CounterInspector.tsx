'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function CounterInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [items, setItems] = useState<any[]>(initialData.items || [
        { label: 'Proyectos', value: 150, suffix: '+' }
    ]);

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Contadores Dinámicos</label>
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg relative">
                            <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1">
                                <Trash2 size={14} />
                            </button>

                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Etiqueta (Bottom)</label>
                            <input type="text" value={item.label} onChange={e => handleItemChange(idx, 'label', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs" />

                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Valor Meta</label>
                                    <input type="number" value={item.value} onChange={e => handleItemChange(idx, 'value', parseInt(e.target.value))} className="w-full border border-slate-200 rounded-md p-2 text-xs text-indigo-600 font-bold" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Sufijo (ej: +, %)</label>
                                    <input type="text" value={item.suffix} onChange={e => handleItemChange(idx, 'suffix', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setItems([...items, { label: 'Nuevo', value: 100, suffix: '%' }])} className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                    <Plus size={14} /> Añadir Contador
                </button>
            </div>

            <button onClick={() => onSave({ items })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function ToggleInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [items, setItems] = useState<any[]>(initialData.items || [
        { title: '¿Qué es esto?', content: 'Una descripción detallada.' },
        { title: '¿Cómo funciona?', content: 'Con magia.' }
    ]);

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Elementos Toggle Independientes</label>
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg relative">
                            <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1">
                                <Trash2 size={14} />
                            </button>
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Pregunta / Título</label>
                            <input type="text" value={item.title} onChange={e => handleItemChange(idx, 'title', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs font-bold" />
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Respuesta / Contenido HTML</label>
                            <textarea rows={3} value={item.content} onChange={e => handleItemChange(idx, 'content', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs resize-none"></textarea>
                        </div>
                    ))}
                </div>
                <button onClick={() => setItems([...items, { title: 'Nueva Pregunta', content: '' }])} className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                    <Plus size={14} /> Añadir Elemento
                </button>
            </div>

            <button onClick={() => onSave({ items })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

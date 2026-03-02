'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import RichTextField from './RichTextField';

export default function TabsInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [style, setStyle] = useState(initialData.style || 'underline');
    const [color, setColor] = useState(initialData.color || 'bg-indigo-500');
    const [items, setItems] = useState<any[]>(initialData.items || [
        { label: 'Visión', content: 'Nuestra visión...' },
        { label: 'Misión', content: 'Nuestra misión...' }
    ]);

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Estilo Gráfico</label>
                    <select value={style} onChange={e => setStyle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="underline">Línea Inferior</option>
                        <option value="pill">Botón (Pill)</option>
                        <option value="default">Caja Clásica</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Color Activo (Pill)</label>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" placeholder="bg-indigo-500" />
                </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pestañas</label>
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg relative">
                            <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1">
                                <Trash2 size={14} />
                            </button>
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Título pestaña</label>
                            <RichTextField
                                value={item.label}
                                onChange={(value) => handleItemChange(idx, 'label', value)}
                                minHeightClass="min-h-[40px]"
                                singleLine
                            />
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Contenido (HTML permitido)</label>
                            <RichTextField
                                value={item.content}
                                onChange={(value) => handleItemChange(idx, 'content', value)}
                                minHeightClass="min-h-[96px]"
                            />
                        </div>
                    ))}
                </div>
                <button onClick={() => setItems([...items, { label: 'Nueva', content: '' }])} className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                    <Plus size={14} /> Añadir Pestaña
                </button>
            </div>

            <button onClick={() => onSave({ style, color, items })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

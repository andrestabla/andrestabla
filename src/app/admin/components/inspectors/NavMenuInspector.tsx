'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function NavMenuInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [style, setStyle] = useState(initialData.style || 'horizontal');
    const [alignment, setAlignment] = useState(initialData.alignment || 'justify-center');
    const [color, setColor] = useState(initialData.color || 'text-slate-600 dark:text-zinc-300');

    const [items, setItems] = useState<any[]>(initialData.items || [
        { label: 'Inicio', link: '#', isButton: false },
        { label: 'Portafolio', link: '#', isButton: false },
        { label: 'Contáctame', link: '#contact', isButton: true }
    ]);

    const handleItemChange = (index: number, field: string, value: any) => {
        const nf = [...items];
        nf[index][field] = value;
        setItems(nf);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Orientación</label>
                    <select value={style} onChange={e => setStyle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white">
                        <option value="horizontal">Línea Horizontal</option>
                        <option value="vertical">Lista Vertical</option>
                        <option value="hamburger">Modo Hamburguesa</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Alineación (Flex)</label>
                    <select value={alignment} onChange={e => setAlignment(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white">
                        <option value="justify-start">Izquierda</option>
                        <option value="justify-center">Centro</option>
                        <option value="justify-end">Derecha</option>
                        <option value="justify-between">Separados</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Color de Enlaces (CSS)</label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs" placeholder="text-slate-600 dark:text-white" />
            </div>

            <div className="border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Enlaces del Menú</label>
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className={`p-3 border rounded-lg relative ${item.isButton ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-800' : 'bg-slate-50 border-slate-200 dark:bg-zinc-800/50 dark:border-zinc-700'}`}>
                            <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1">
                                <Trash2 size={14} />
                            </button>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Etiqueta</label>
                                    <input type="text" value={item.label} onChange={e => handleItemChange(idx, 'label', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs font-bold" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Destino/Ancla</label>
                                    <input type="text" value={item.link} onChange={e => handleItemChange(idx, 'link', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs font-mono" />
                                </div>
                            </div>

                            <div className="mt-3 flex items-center">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest cursor-pointer">
                                    <input type="checkbox" checked={item.isButton} onChange={e => handleItemChange(idx, 'isButton', e.target.checked)} className="rounded border-indigo-300 text-indigo-500" />
                                    Convertir en Botón Destacado
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setItems([...items, { label: 'Nuevo Enlace', link: '#', isButton: false }])} className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                    <Plus size={14} /> Agrega Enlace
                </button>
            </div>

            <button onClick={() => onSave({ style, alignment, color, items })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-2 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

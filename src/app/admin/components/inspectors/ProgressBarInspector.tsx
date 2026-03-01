'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function ProgressBarInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [color, setColor] = useState(initialData.color || 'bg-indigo-500');
    const [showPercentage, setShowPercentage] = useState(initialData.showPercentage !== undefined ? initialData.showPercentage : true);
    const [thickness, setThickness] = useState(initialData.thickness || 'h-2');

    const [items, setItems] = useState<any[]>(initialData.items || [
        { label: 'React / Next.js', percentage: 90 },
        { label: 'UI/UX Design', percentage: 80 }
    ]);

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { label: 'Nueva Habilidad', percentage: 50 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Color (Clase Bg)</label>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" placeholder="bg-indigo-500" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Grosor de Barra</label>
                    <select value={thickness} onChange={e => setThickness(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="h-1">Muy Fina (1)</option>
                        <option value="h-2">Fina (2)</option>
                        <option value="h-4">Normal (4)</option>
                        <option value="h-6">Gruesa (6)</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">
                    <input type="checkbox" checked={showPercentage} onChange={e => setShowPercentage(e.target.checked)} className="rounded border-slate-300" />
                    Mostrar Número de Porcentaje
                </label>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Habilidades / Métricas</label>

                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg relative">
                            <button onClick={() => handleRemoveItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1">
                                <Trash2 size={14} />
                            </button>

                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Etiqueta</label>
                            <input
                                type="text"
                                value={item.label}
                                onChange={e => handleItemChange(idx, 'label', e.target.value)}
                                className="w-full border border-slate-200 rounded-md p-2 text-xs"
                                placeholder="Ej: Figma"
                            />
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Porcentaje</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={item.percentage}
                                    onChange={e => handleItemChange(idx, 'percentage', parseInt(e.target.value))}
                                    className="w-full accent-indigo-500"
                                />
                                <span className="font-mono text-xs w-8 text-right font-bold text-indigo-600">{item.percentage}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={handleAddItem} className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                    <Plus size={14} /> Añadir Barra
                </button>
            </div>

            <button onClick={() => onSave({ color, showPercentage, thickness, items })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function SocialInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [size, setSize] = useState(initialData.size || 'w-10 h-10');
    const [style, setStyle] = useState(initialData.style || 'outline'); // outline, solid, ghost
    const [alignment, setAlignment] = useState(initialData.alignment || 'justify-center');

    const [items, setItems] = useState<any[]>(initialData.items || [
        { network: 'linkedin', url: 'https://linkedin.com' },
        { network: 'github', url: 'https://github.com' }
    ]);

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { network: 'website', url: 'https://' }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Estilo</label>
                    <select value={style} onChange={e => setStyle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="outline">Delineado (Outline)</option>
                        <option value="solid">Sólido (Filled)</option>
                        <option value="ghost">Fantasma (Minimal)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tamaño</label>
                    <select value={size} onChange={e => setSize(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="w-8 h-8">Pequeño</option>
                        <option value="w-10 h-10">Normal</option>
                        <option value="w-12 h-12 text-xl">Grande</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Alineación</label>
                <select value={alignment} onChange={e => setAlignment(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                    <option value="justify-start">Izquierda</option>
                    <option value="justify-center">Centro</option>
                    <option value="justify-end">Derecha</option>
                </select>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Enlaces / Redes</label>

                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg relative">
                            <button onClick={() => handleRemoveItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1">
                                <Trash2 size={14} />
                            </button>

                            <select value={item.network} onChange={e => handleItemChange(idx, 'network', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs bg-white pr-8">
                                <option value="linkedin">LinkedIn</option>
                                <option value="github">GitHub</option>
                                <option value="twitter">X (Twitter)</option>
                                <option value="instagram">Instagram</option>
                                <option value="youtube">YouTube</option>
                                <option value="email">Email</option>
                                <option value="website">Sitio Web (Globo)</option>
                            </select>
                            <input
                                type="text"
                                value={item.url}
                                onChange={e => handleItemChange(idx, 'url', e.target.value)}
                                className="w-full border border-slate-200 rounded-md p-2 text-xs font-mono"
                                placeholder="https://"
                            />
                        </div>
                    ))}
                </div>

                <button onClick={handleAddItem} className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                    <Plus size={14} /> Añadir Red
                </button>
            </div>

            <button onClick={() => onSave({ size, style, alignment, items })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

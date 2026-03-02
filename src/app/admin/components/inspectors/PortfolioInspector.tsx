'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type PortfolioItem = {
    title: string;
    category: string;
    image: string;
    link?: string;
};

const DEFAULT_ITEMS: PortfolioItem[] = [
    {
        title: 'Project Alpha',
        category: 'web',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
        link: '#',
    },
    {
        title: 'Brand Identity',
        category: 'design',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
        link: '#',
    },
    {
        title: 'Mobile App',
        category: 'app',
        image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop',
        link: '#',
    },
];

export default function PortfolioInspector({
    initialData,
    onSave,
    isSaving,
}: {
    initialData: any;
    onSave: (data: any) => void;
    isSaving: boolean;
}) {
    const [columns, setColumns] = useState(initialData.columns || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
    const [gap, setGap] = useState(initialData.gap || 'gap-4');
    const [items, setItems] = useState<PortfolioItem[]>(
        Array.isArray(initialData.items) && initialData.items.length > 0 ? initialData.items : DEFAULT_ITEMS
    );

    const handleItemChange = (index: number, field: keyof PortfolioItem, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const addItem = () => {
        setItems([
            ...items,
            { title: 'Nuevo Proyecto', category: 'web', image: '', link: '#' },
        ]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        const sanitizedItems = items
            .map((item) => ({
                title: (item.title || '').trim(),
                category: (item.category || '').trim() || 'general',
                image: (item.image || '').trim(),
                link: (item.link || '').trim(),
            }))
            .filter((item) => item.title || item.image);

        onSave({ columns, gap, items: sanitizedItems });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl mb-1">
                <p className="text-[10px] text-slate-600 font-medium">
                    Aquí agregas y editas cada proyecto/producto del portafolio.
                    El filtro superior se construye automáticamente con las categorías que pongas.
                </p>
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

            <div className="mt-1 border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Proyectos / Productos</label>
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="relative bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                            <button onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1" type="button">
                                <Trash2 size={14} />
                            </button>

                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Título</label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={e => handleItemChange(idx, 'title', e.target.value)}
                                className="w-full border border-slate-200 rounded-md p-2 text-xs"
                                placeholder="Nombre del proyecto"
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Categoría</label>
                                    <input
                                        type="text"
                                        value={item.category}
                                        onChange={e => handleItemChange(idx, 'category', e.target.value)}
                                        className="w-full border border-slate-200 rounded-md p-2 text-xs"
                                        placeholder="web, design, app..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Link (Opcional)</label>
                                    <input
                                        type="text"
                                        value={item.link || ''}
                                        onChange={e => handleItemChange(idx, 'link', e.target.value)}
                                        className="w-full border border-slate-200 rounded-md p-2 text-xs"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">URL Imagen</label>
                            <input
                                type="text"
                                value={item.image}
                                onChange={e => handleItemChange(idx, 'image', e.target.value)}
                                className="w-full border border-slate-200 rounded-md p-2 text-xs font-mono"
                                placeholder="https://..."
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={addItem}
                    type="button"
                    className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                    <Plus size={14} /> Añadir Proyecto
                </button>
            </div>

            <button onClick={handleSave} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-3 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

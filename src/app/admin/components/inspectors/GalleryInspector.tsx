'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function GalleryInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [columns, setColumns] = useState(initialData.columns || 'grid-cols-2 md:grid-cols-3');
    const [gap, setGap] = useState(initialData.gap || 'gap-4');

    const [images, setImages] = useState<any[]>(initialData.images || [
        { url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop', alt: 'Imagen de Galería 1' }
    ]);

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...images];
        newItems[index][field] = value;
        setImages(newItems);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Columnas (Grid)</label>
                    <select value={columns} onChange={e => setColumns(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="grid-cols-1 md:grid-cols-2">2 Columnas Desktop</option>
                        <option value="grid-cols-2 md:grid-cols-3">3 Columnas Grilla</option>
                        <option value="grid-cols-2 md:grid-cols-4">4 Columnas Densa</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Espaciado Interno</label>
                    <select value={gap} onChange={e => setGap(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="gap-0">Sin Espacio (Collage)</option>
                        <option value="gap-2">Grosor Mínimo</option>
                        <option value="gap-4">Estándar</option>
                        <option value="gap-8">Separado</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Imágenes (Aspecto Cuadrado)</label>
                <div className="space-y-3">
                    {images.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg relative">
                            <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1">
                                <Trash2 size={14} />
                            </button>
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">URL Imagen</label>
                            <input type="text" value={item.url} onChange={e => handleItemChange(idx, 'url', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs font-mono" placeholder="https://" />
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Texto Hover Corto (Alt)</label>
                            <input type="text" value={item.alt} onChange={e => handleItemChange(idx, 'alt', e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs" />
                        </div>
                    ))}
                </div>
                <button onClick={() => setImages([...images, { url: '', alt: 'Nueva Imagen' }])} className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                    <Plus size={14} /> Añadir Foto a Galería
                </button>
            </div>

            <button onClick={() => onSave({ columns, gap, images })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

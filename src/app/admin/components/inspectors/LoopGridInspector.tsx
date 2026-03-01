'use client';

import { useState } from 'react';

export default function LoopGridInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [postType, setPostType] = useState(initialData.postType || 'blog');
    const [columns, setColumns] = useState(initialData.columns || 'grid-cols-1 md:grid-cols-3');
    const [limit, setLimit] = useState(initialData.limit || 3);
    const [showImage, setShowImage] = useState(initialData.showImage !== undefined ? initialData.showImage : true);

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl mb-2">
                <p className="text-[10px] text-indigo-600 font-medium">Este es un Widget Dinámico (PRO). Simula extraer datos directamente de la Base de Datos para renderizarlos en un loop visual.</p>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fuente de Datos</label>
                <select value={postType} onChange={e => setPostType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white font-bold">
                    <option value="blog">Entradas de Blog</option>
                    <option value="portfolio">Proyectos de Portafolio</option>
                    <option value="services">Servicios Activos</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Columnas</label>
                    <select value={columns} onChange={e => setColumns(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white">
                        <option value="grid-cols-1 md:grid-cols-2">2 (Desktop)</option>
                        <option value="grid-cols-1 md:grid-cols-3">3 (Estándar)</option>
                        <option value="grid-cols-2 md:grid-cols-4">4 (Denso)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Límite a mostrar</label>
                    <input type="number" value={limit} onChange={e => setLimit(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs" min={1} max={12} />
                </div>
            </div>

            <div className="flex flex-col items-start justify-center mt-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">
                    <input type="checkbox" checked={showImage} onChange={e => setShowImage(e.target.checked)} className="rounded border-slate-300" />
                    Mostrar Imágenes de Portada (Thumbnails)
                </label>
            </div>

            <button onClick={() => onSave({ postType, columns, limit, showImage })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-4 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

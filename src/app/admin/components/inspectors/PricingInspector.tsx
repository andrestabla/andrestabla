'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function PricingInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [title, setTitle] = useState(initialData.title || 'Membresía Pro');
    const [price, setPrice] = useState(initialData.price || '$99');
    const [period, setPeriod] = useState(initialData.period || '/mes');
    const [format, setFormat] = useState(initialData.format || 'card');
    const [color, setColor] = useState(initialData.color || 'bg-indigo-500');
    const [buttonText, setButtonText] = useState(initialData.buttonText || 'Comenzar');
    const [buttonLink, setButtonLink] = useState(initialData.buttonLink || '#');
    const [isPopular, setIsPopular] = useState(initialData.isPopular !== undefined ? initialData.isPopular : false);

    const [features, setFeatures] = useState<any[]>(initialData.features || [
        { text: 'Acceso total', included: true },
        { text: 'Soporte VIP', included: false }
    ]);

    const handleFeatureChange = (index: number, field: string, value: any) => {
        const nf = [...features];
        nf[index][field] = value;
        setFeatures(nf);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Título</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs font-bold" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Color Acento</label>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Precio</label>
                    <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs font-bold text-indigo-600" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Período (ej: /mes)</label>
                    <input type="text" value={period} onChange={e => setPeriod(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Formato Gráfico</label>
                    <select value={format} onChange={e => setFormat(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white">
                        <option value="card">Tarjeta 3D Clásica</option>
                        <option value="minimalist">Horizontal Minimalista</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer mt-4">
                        <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} className="rounded border-slate-300" />
                        Destacar (Popular)
                    </label>
                </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Botón de Compra</label>
                <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={buttonText} onChange={e => setButtonText(e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs" placeholder="Texto" />
                    <input type="text" value={buttonLink} onChange={e => setButtonLink(e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs font-mono" placeholder="Enlace (URL)" />
                </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Características</label>
                <div className="space-y-2">
                    {features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                            <input type="checkbox" checked={feat.included} onChange={e => handleFeatureChange(idx, 'included', e.target.checked)} className="rounded border-slate-300 text-emerald-500 flex-shrink-0 mx-2" title="¿Incluido?" />
                            <input type="text" value={feat.text} onChange={e => handleFeatureChange(idx, 'text', e.target.value)} className={`w-full text-xs bg-transparent outline-none ${!feat.included ? 'opacity-50' : ''}`} placeholder="Característica" />
                            <button onClick={() => setFeatures(features.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500 p-1 flex-shrink-0">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={() => setFeatures([...features, { text: 'Nuevo', included: true }])} className="w-full mt-2 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50">
                    <Plus size={14} /> Añadir Beneficio
                </button>
            </div>

            <button onClick={() => onSave({ title, price, period, format, color, buttonText, buttonLink, isPopular, features })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-2 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

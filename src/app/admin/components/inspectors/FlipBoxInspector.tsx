'use client';

import { useState } from 'react';
import RichTextField from './RichTextField';

export default function FlipBoxInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [frontIcon, setFrontIcon] = useState(initialData.frontIcon || '🚀');
    const [frontTitle, setFrontTitle] = useState(initialData.frontTitle || 'Lanzamiento');
    const [frontDesc, setFrontDesc] = useState(initialData.frontDesc || 'Hover para ver más...');
    const [frontBgColor, setFrontBgColor] = useState(initialData.frontBgColor || 'bg-slate-50 dark:bg-zinc-800');

    const [backTitle, setBackTitle] = useState(initialData.backTitle || 'Detalles');
    const [backDesc, setBackDesc] = useState(initialData.backDesc || 'Descripción...');
    const [backBgColor, setBackBgColor] = useState(initialData.backBgColor || 'bg-indigo-500 text-white');

    const [buttonText, setButtonText] = useState(initialData.buttonText || '');
    const [buttonLink, setButtonLink] = useState(initialData.buttonLink || '#');

    const [height, setHeight] = useState(initialData.height || 'h-80');
    const [direction, setDirection] = useState(initialData.direction || 'horizontal');

    return (
        <div className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Altura</label>
                    <select value={height} onChange={e => setHeight(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white">
                        <option value="h-64">Normal (64)</option>
                        <option value="h-80">Alto (80)</option>
                        <option value="h-96">Muy Alto (96)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Eje de Giro</label>
                    <select value={direction} onChange={e => setDirection(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white">
                        <option value="horizontal">Horizontal (Izq-Der)</option>
                        <option value="vertical">Vertical (Arr-Abj)</option>
                    </select>
                </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800 mb-3 border-b border-slate-200 pb-2">Cara Frontal</h4>
                <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-1">
                            <label className="block text-[9px] text-slate-500">Emoji/Icono</label>
                            <input type="text" value={frontIcon} onChange={e => setFrontIcon(e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs text-center text-xl" />
                        </div>
                        <div className="col-span-3">
                            <label className="block text-[9px] text-slate-500">Título</label>
                            <RichTextField
                                value={frontTitle}
                                onChange={setFrontTitle}
                                minHeightClass="min-h-[40px]"
                                singleLine
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] text-slate-500">Descripción Corta</label>
                        <RichTextField
                            value={frontDesc}
                            onChange={setFrontDesc}
                            minHeightClass="min-h-[72px]"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] text-slate-500">Color/Clase CSS de Fondo</label>
                        <input type="text" value={frontBgColor} onChange={e => setFrontBgColor(e.target.value)} className="w-full border border-slate-200 rounded-md p-2 text-xs font-mono" placeholder="bg-slate-50" />
                    </div>
                </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-800 mb-3 border-b border-indigo-200 pb-2">Cara Trasera (Al Girar)</h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-[9px] text-indigo-500">Título Trasero</label>
                        <RichTextField
                            value={backTitle}
                            onChange={setBackTitle}
                            minHeightClass="min-h-[40px]"
                            singleLine
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] text-indigo-500">Texto Largo</label>
                        <RichTextField
                            value={backDesc}
                            onChange={setBackDesc}
                            minHeightClass="min-h-[72px]"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] text-indigo-500">Color/Clase CSS de Fondo</label>
                        <input type="text" value={backBgColor} onChange={e => setBackBgColor(e.target.value)} className="w-full border border-indigo-200 rounded-md p-2 text-xs font-mono" placeholder="bg-indigo-500 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-indigo-200/50">
                        <div>
                            <label className="block text-[9px] text-indigo-500">Botón (Opcional)</label>
                            <RichTextField
                                value={buttonText}
                                onChange={setButtonText}
                                placeholder="Texto (Vacio=0)"
                                minHeightClass="min-h-[40px]"
                                singleLine
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] text-indigo-500">Link Botón</label>
                            <input type="text" value={buttonLink} onChange={e => setButtonLink(e.target.value)} className="w-full border border-indigo-200 rounded-md p-2 text-xs font-mono" placeholder="URL" />
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => onSave({ frontIcon, frontTitle, frontDesc, frontBgColor, backTitle, backDesc, backBgColor, buttonText, buttonLink, height, direction })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-2 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

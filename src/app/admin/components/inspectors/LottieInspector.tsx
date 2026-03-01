'use client';

import { useState } from 'react';

export default function LottieInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [jsonUrl, setJsonUrl] = useState(initialData.jsonUrl || 'https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json');
    const [height, setHeight] = useState(initialData.height || 'h-64');
    const [loop, setLoop] = useState(initialData.loop !== undefined ? initialData.loop : true);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">URL del JSON (LottieFiles)</label>
                <input type="text" value={jsonUrl} onChange={e => setJsonUrl(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono" placeholder="https://.../data.json" />
                <p className="text-[9px] text-slate-400 mt-2">Puedes buscar miles de animaciones gratis en LottieFiles.com y pegar aquí su enlace "Lottie JSON".</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Altura</label>
                    <select value={height} onChange={e => setHeight(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                        <option value="h-32">Pequeña (8rem)</option>
                        <option value="h-64">Normal (16rem)</option>
                        <option value="h-96">Grande (24rem)</option>
                        <option value="h-[500px]">Enorme (500px)</option>
                    </select>
                </div>
                <div className="flex flex-col items-start justify-center">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer mt-4">
                        <input type="checkbox" checked={loop} onChange={e => setLoop(e.target.checked)} className="rounded border-slate-300" />
                        Loop (Bucle Infinito)
                    </label>
                </div>
            </div>

            <button onClick={() => onSave({ jsonUrl, height, loop })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-6 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

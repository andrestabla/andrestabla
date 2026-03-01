'use client';

import { useState } from 'react';

export default function FormInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [title, setTitle] = useState(initialData.title || 'Contáctanos');
    const [subtitle, setSubtitle] = useState(initialData.subtitle || 'Déjanos un mensaje y te responderemos pronto.');
    const [buttonText, setButtonText] = useState(initialData.buttonText || 'Enviar Mensaje');
    const [emailTo, setEmailTo] = useState(initialData.emailTo || 'andrestabla@algoritmot.com');

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Título del Formulario</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Subtítulo o Descripción</label>
                <textarea rows={2} value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm resize-none"></textarea>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Texto del Botón (CTA)</label>
                <input type="text" value={buttonText} onChange={e => setButtonText(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">Email Receptor (Simulado)</label>
                <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="w-full border border-indigo-200 rounded-lg p-2 text-xs" />
                <p className="text-[9px] text-indigo-400 mt-2">Actualmente el formulario solo simula el envío con un estado visual de carga y éxito.</p>
            </div>
            <button onClick={() => onSave({ title, subtitle, buttonText, emailTo })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

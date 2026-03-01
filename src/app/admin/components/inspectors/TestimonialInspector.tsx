'use client';

import { useState } from 'react';

export default function TestimonialInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [quote, setQuote] = useState(initialData.quote || 'Excelente profesional, una experiencia increíble de trabajo.');
    const [author, setAuthor] = useState(initialData.author || 'Jane Doe');
    const [role, setRole] = useState(initialData.role || 'CEO, Company Inc.');
    const [avatar, setAvatar] = useState(initialData.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026024d');

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cita / Testimonio (Quote)</label>
                <textarea rows={3} value={quote} onChange={e => setQuote(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm resize-none"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Autor</label>
                    <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Rol / Cargo</label>
                    <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Ej: CEO" />
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">URL del Avatar (Foto)</label>
                <input type="text" value={avatar} onChange={e => setAvatar(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono" placeholder="https://..." />
            </div>

            <button onClick={() => onSave({ quote, author, role, avatar })} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 mt-4">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

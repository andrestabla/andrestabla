import { useState } from 'react';
import { Save } from 'lucide-react';

export default function HeroInspector({ initialData, onSave, isSaving }: any) {
    const [data, setData] = useState(initialData);

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                <input name="name" value={data.name || ''} onChange={handleChange} className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-800" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cargo / Especialidad</label>
                <textarea name="role" value={data.role || ''} onChange={handleChange} rows={2} className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-all text-slate-600 resize-none" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Eslogan</label>
                <input name="tagline" value={data.tagline || ''} onChange={handleChange} className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-all text-slate-600" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                    <input name="phone" value={data.phone || ''} onChange={handleChange} className="w-full text-xs border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-all text-slate-600" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input name="email" value={data.email || ''} onChange={handleChange} className="w-full text-xs border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-all text-slate-600" />
                </div>
            </div>

            <button
                onClick={() => onSave(data)}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-black text-white p-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 mt-4 shadow-md"
            >
                <Save size={14} /> {isSaving ? 'Actualizando...' : 'Guardar y Previsualizar'}
            </button>
        </div>
    );
}

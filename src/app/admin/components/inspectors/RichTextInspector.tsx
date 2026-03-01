import { useState } from 'react';
import { Save } from 'lucide-react';

export default function RichTextInspector({ initialData, onSave, isSaving }: any) {
    const [data, setData] = useState(initialData);

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título de la Sección</label>
                <input name="title" value={data.title || ''} onChange={handleChange} className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-800" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contenido HTML / Editor de Texto</label>
                <textarea
                    name="content"
                    value={data.content || ''}
                    onChange={handleChange}
                    rows={12}
                    className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-all text-slate-700 resize-none shadow-inner"
                    placeholder="<p>Escribe en HTML o texto plano...</p>"
                />
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

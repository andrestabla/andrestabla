import { useState } from 'react';
import { Save } from 'lucide-react';
import RichTextField from './RichTextField';

export default function RichTextInspector({ initialData, onSave, isSaving }: any) {
    const [data, setData] = useState(initialData);

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título de la Sección</label>
                <RichTextField
                    value={data.title || ''}
                    onChange={(value) => setData({ ...data, title: value })}
                    minHeightClass="min-h-[44px]"
                    singleLine
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contenido Enriquecido</label>
                <RichTextField
                    value={data.content || ''}
                    onChange={(value) => setData({ ...data, content: value })}
                    placeholder="Escribe texto enriquecido aquí..."
                    minHeightClass="min-h-[240px]"
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

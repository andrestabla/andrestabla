import { useState } from 'react';
import { Save, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import RichTextField from './RichTextField';

export default function HeroInspector({ initialData, onSave, isSaving }: any) {
    const [data, setData] = useState(initialData);

    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleLinkChange = (index: number, field: string, value: string) => {
        const newLinks = [...(data.links || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setData({ ...data, links: newLinks });
    };

    const addLink = () => {
        const newLinks = [...(data.links || []), { label: 'Nuevo Enlace', url: 'https://' }];
        setData({ ...data, links: newLinks });
    };

    const removeLink = (index: number) => {
        const newLinks = data.links.filter((_: any, i: number) => i !== index);
        setData({ ...data, links: newLinks });
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4">

            {/* Información Principal */}
            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Saludo (Greeting)</label>
                    <RichTextField
                        value={data.greeting || ''}
                        onChange={(value) => setData({ ...data, greeting: value })}
                        placeholder="Hello, I am"
                        minHeightClass="min-h-[44px]"
                        singleLine
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                    <RichTextField
                        value={data.name || ''}
                        onChange={(value) => setData({ ...data, name: value })}
                        minHeightClass="min-h-[44px]"
                        singleLine
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cargo / Especialidad</label>
                    <RichTextField
                        value={data.role || ''}
                        onChange={(value) => setData({ ...data, role: value })}
                        placeholder="Describe tu rol profesional"
                        minHeightClass="min-h-[72px]"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Eslogan / Tagline</label>
                    <RichTextField
                        value={data.tagline || ''}
                        onChange={(value) => setData({ ...data, tagline: value })}
                        placeholder="Tu frase de valor"
                        minHeightClass="min-h-[72px]"
                    />
                </div>

            </div>

            {/* Contacto */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                    <input name="phone" value={data.phone || ''} onChange={handleChange} className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-all text-slate-600" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input name="email" value={data.email || ''} onChange={handleChange} className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-all text-slate-600" />
                </div>
            </div>

            {/* Enlaces (Links) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Botones de Enlace</label>
                    <button onClick={addLink} className="text-blue-600 hover:text-blue-700 p-1 flex items-center gap-1 font-bold text-[10px] uppercase">
                        <Plus size={12} /> Añadir
                    </button>
                </div>

                <div className="space-y-3">
                    {(data.links || []).map((link: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm space-y-2 group relative">
                            <button onClick={() => removeLink(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 size={14} />
                            </button>
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">Texto del Botón</label>
                                <RichTextField
                                    value={link.label}
                                    onChange={(value) => handleLinkChange(idx, 'label', value)}
                                    minHeightClass="min-h-[40px]"
                                    singleLine
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">URL (Enlace)</label>
                                <div className="flex items-center gap-2">
                                    <LinkIcon size={12} className="text-slate-400" />
                                    <input value={link.url} onChange={(e) => handleLinkChange(idx, 'url', e.target.value)} className="flex-1 text-xs border border-slate-100 p-2 rounded bg-slate-50 focus:bg-white focus:border-blue-300 transition-all" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!data.links || data.links.length === 0) && (
                        <div className="text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs italic">
                            No hay enlaces añadidos
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={() => onSave(data)}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-indigo-100"
            >
                <Save size={16} /> {isSaving ? 'Actualizando...' : 'Guardar y Previsualizar'}
            </button>
        </div>
    );
}

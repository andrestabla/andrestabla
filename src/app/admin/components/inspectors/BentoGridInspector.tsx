import { useState } from 'react';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';

export default function BentoGridInspector({ initialData, onSave, isSaving }: any) {
    const [data, setData] = useState(initialData);

    const handleFieldChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index: number, e: any) => {
        const newItems = [...(data.items || [])];
        newItems[index] = { ...newItems[index], [e.target.name]: e.target.value };
        setData({ ...data, items: newItems });
    };

    const addItem = () => {
        const newItems = [...(data.items || []), { id: Date.now().toString(), title: "Nueva Tarjeta", meta: "Etiqueta", body: "Detalle" }];
        setData({ ...data, items: newItems });
    };

    const removeItem = (index: number) => {
        const newItems = [...(data.items || [])];
        newItems.splice(index, 1);
        setData({ ...data, items: newItems });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título del Grid</label>
                <input name="title" value={data.title || ''} onChange={handleFieldChange} className="w-full text-sm border-b-2 border-slate-200 bg-transparent py-2 outline-none focus:border-black transition-all font-bold text-slate-800" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Diseño Bento</label>
                <select name="bentoType" value={data.bentoType || 'general'} onChange={handleFieldChange} className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 bg-white cursor-pointer">
                    <option value="general">Texto Simple (General)</option>
                    <option value="education">Modo Educación (Grado e Institución)</option>
                    <option value="courses">Modo Cursos (Cajas Cuadradas)</option>
                </select>
            </div>

            <div className="space-y-4">
                {(data.items || []).map((item: any, idx: number) => (
                    <div key={item.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">

                        <div className="absolute top-0 right-0 p-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-100"><Trash2 size={14} /></button>
                        </div>

                        <div className="flex items-center gap-2 mb-3 cursor-grab text-slate-400 hover:text-black">
                            <GripVertical size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Tarjeta #{idx + 1}</span>
                        </div>

                        <input name="title" value={item.title} onChange={(e) => handleItemChange(idx, e)} className="text-sm font-bold border border-slate-200 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none mb-2" placeholder="Título Principal" />

                        {data.bentoType === 'education' && (
                            <>
                                <input name="subtitle" value={item.subtitle} onChange={(e) => handleItemChange(idx, e)} className="text-sm border border-slate-200 rounded-md p-2 w-full mb-2 focus:border-blue-500 focus:outline-none" placeholder="Institución (Ej. Univ. Complutense)" />
                                <input name="meta" value={item.meta} onChange={(e) => handleItemChange(idx, e)} className="text-[10px] uppercase font-bold text-blue-600 border border-slate-200 rounded-md p-2 w-full mb-2 focus:border-blue-500 focus:outline-none" placeholder="Etiqueta / Año (Ej. 2024)" />
                            </>
                        )}

                        {data.bentoType === 'general' && (
                            <textarea name="body" value={item.body} onChange={(e) => handleItemChange(idx, e)} rows={3} className="text-xs text-slate-600 border border-slate-200 rounded-md p-2 w-full resize-none focus:border-blue-500 focus:outline-none" placeholder="Contenido o detalle..." />
                        )}

                    </div>
                ))}
            </div>

            <button onClick={addItem} className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl p-3 hover:border-black hover:text-black transition-all font-medium text-xs">
                <Plus size={14} /> Añadir Tarjeta
            </button>

            <button
                onClick={() => onSave(data)}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-black text-white p-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 mt-2 shadow-md"
            >
                <Save size={14} /> {isSaving ? 'Actualizando...' : 'Guardar y Previsualizar'}
            </button>
        </div>
    );
}

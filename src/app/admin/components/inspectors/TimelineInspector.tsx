import { useState } from 'react';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import RichTextField from './RichTextField';

export default function TimelineInspector({ initialData, onSave, isSaving }: any) {
    const [data, setData] = useState(initialData);

    const handleItemChange = (index: number, e: any) => {
        const newItems = [...(data.items || [])];
        newItems[index] = { ...newItems[index], [e.target.name]: e.target.value };
        setData({ ...data, items: newItems });
    };

    const addItem = () => {
        const newItems = [...(data.items || []), { id: Date.now().toString(), title: "Nuevo Título", subtitle: "Nueva Subentidad", meta: "Periodo", body: "Descripción..." }];
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título de la Línea de Tiempo</label>
                <RichTextField
                    value={data.title || ''}
                    onChange={(value) => setData({ ...data, title: value })}
                    minHeightClass="min-h-[44px]"
                    singleLine
                />
            </div>

            <div className="space-y-4">
                {(data.items || []).map((item: any, idx: number) => (
                    <div key={item.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">

                        <div className="absolute top-0 right-0 p-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-100"><Trash2 size={14} /></button>
                        </div>

                        <div className="flex items-center gap-2 mb-3 cursor-grab text-slate-400 hover:text-black">
                            <GripVertical size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Ítem #{idx + 1}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <RichTextField
                                value={item.title}
                                onChange={(value) => handleItemChange(idx, { target: { name: 'title', value } })}
                                placeholder="Cargo o Título"
                                minHeightClass="min-h-[40px]"
                                singleLine
                            />
                            <RichTextField
                                value={item.subtitle}
                                onChange={(value) => handleItemChange(idx, { target: { name: 'subtitle', value } })}
                                placeholder="Empresa o Institución"
                                minHeightClass="min-h-[40px]"
                                singleLine
                            />
                        </div>
                        <RichTextField
                            value={item.meta}
                            onChange={(value) => handleItemChange(idx, { target: { name: 'meta', value } })}
                            placeholder="Periodo (Ej. 2020 - 2023)"
                            minHeightClass="min-h-[40px]"
                            singleLine
                            className="mb-2"
                        />
                        <RichTextField
                            value={item.body}
                            onChange={(value) => handleItemChange(idx, { target: { name: 'body', value } })}
                            placeholder="Descripción de las funciones..."
                            minHeightClass="min-h-[84px]"
                        />
                    </div>
                ))}
            </div>

            <button onClick={addItem} className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl p-3 hover:border-black hover:text-black transition-all font-medium text-xs">
                <Plus size={14} /> Añadir Ítem a la Línea
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

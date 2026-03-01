import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AccordionInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [title, setTitle] = useState(initialData.title || '');
    const [items, setItems] = useState<any[]>(initialData.items || [{ question: '¿Cómo funciona esto?', answer: 'Es muy sencillo...' }]);

    const updateItem = (index: number, key: string, value: string) => {
        const newItems = [...items];
        newItems[index][key] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { question: 'Nueva Pregunta', answer: '...' }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, items });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Título del Acordeón (Opcional)</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Preguntas Frecuentes (FAQ)" className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 mb-4" />

                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-lg relative group">
                            <button type="button" onClick={() => removeItem(index)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                            <input type="text" value={item.question} onChange={e => updateItem(index, 'question', e.target.value)} placeholder="Pregunta/Título" className="w-full text-xs p-2 font-bold border-none bg-slate-50 rounded focus:ring-1 focus:ring-indigo-100" />
                            <textarea value={item.answer} onChange={e => updateItem(index, 'answer', e.target.value)} placeholder="Respuesta..." className="w-full text-xs p-2 border-none bg-slate-50 rounded min-h-[60px] focus:ring-1 focus:ring-indigo-100" />
                        </div>
                    ))}
                </div>

                <button type="button" onClick={addItem} className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-2 rounded-lg transition-colors">
                    <Plus size={14} /> Añadir Panel
                </button>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-colors">
                {isSaving ? 'Guardando...' : 'Actualizar Acordeón'}
            </button>
        </form>
    );
}

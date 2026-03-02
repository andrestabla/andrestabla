import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import RichTextField from './RichTextField';

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
                <RichTextField
                    value={title}
                    onChange={setTitle}
                    placeholder="Ej: Preguntas Frecuentes (FAQ)"
                    minHeightClass="min-h-[44px]"
                    singleLine
                    className="mb-4"
                />

                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-lg relative group">
                            <button type="button" onClick={() => removeItem(index)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                            <RichTextField
                                value={item.question}
                                onChange={(value) => updateItem(index, 'question', value)}
                                placeholder="Pregunta/Título"
                                minHeightClass="min-h-[40px]"
                                singleLine
                            />
                            <RichTextField
                                value={item.answer}
                                onChange={(value) => updateItem(index, 'answer', value)}
                                placeholder="Respuesta..."
                                minHeightClass="min-h-[80px]"
                            />
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

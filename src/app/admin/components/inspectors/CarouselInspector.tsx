import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function CarouselInspector({ initialData, onSave, isSaving }: { initialData: any, onSave: (data: any) => void, isSaving: boolean }) {
    const [images, setImages] = useState<any[]>(initialData.images || []);
    const [height, setHeight] = useState(initialData.height || 'h-[400px]');
    const [autoPlay, setAutoPlay] = useState(initialData.autoPlay !== false);

    const updateImage = (index: number, key: string, value: string) => {
        const newImages = [...images];
        newImages[index][key] = value;
        setImages(newImages);
    };

    const addImage = () => setImages([...images, { url: '', caption: '' }]);
    const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ images, height, autoPlay });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Altura</label>
                        <select value={height} onChange={e => setHeight(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white">
                            <option value="h-[300px]">300px (Banner)</option>
                            <option value="h-[500px]">500px (Destacado)</option>
                            <option value="h-screen">Pantalla Completa</option>
                        </select>
                    </div>
                    <div className="flex items-end mb-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <input type="checkbox" checked={autoPlay} onChange={e => setAutoPlay(e.target.checked)} className="rounded text-indigo-600" />
                            Auto Play
                        </label>
                    </div>
                </div>

                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block border-t pt-4 border-slate-200">Diapositivas (Slides)</label>
                <div className="space-y-3">
                    {images.map((img, index) => (
                        <div key={index} className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-lg relative group">
                            <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                            <input type="text" value={img.url} onChange={e => updateImage(index, 'url', e.target.value)} placeholder="URL de la imagen (Ej: Unsplash)" className="w-full text-xs p-2 font-mono border-none bg-slate-50 rounded focus:ring-1 focus:ring-indigo-100 pr-8" />
                            <input type="text" value={img.caption} onChange={e => updateImage(index, 'caption', e.target.value)} placeholder="Texto superpuesto (Opcional)" className="w-full text-xs p-2 border-none bg-slate-50 rounded focus:ring-1 focus:ring-indigo-100" />
                        </div>
                    ))}
                </div>

                <button type="button" onClick={addImage} className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-2 rounded-lg transition-colors">
                    <Plus size={14} /> Añadir Slide
                </button>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-colors">
                {isSaving ? 'Guardando...' : 'Actualizar Carrusel'}
            </button>
        </form>
    );
}

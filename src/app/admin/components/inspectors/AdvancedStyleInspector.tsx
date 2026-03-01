import { useState } from 'react';
import { updateBlockStyles } from '../actions';

export default function AdvancedStyleInspector({ block, onSaved }: { block: any, onSaved: () => void }) {
    const [isSaving, setIsSaving] = useState(false);

    let parsedStyles: any = {};
    if (block.styles) {
        try { parsedStyles = JSON.parse(block.styles); } catch (e) { }
    }

    const [bgColor, setBgColor] = useState(parsedStyles.backgroundColor || '');
    const [bgImage, setBgImage] = useState(parsedStyles.backgroundImage || '');
    const [paddingTop, setPaddingTop] = useState(parsedStyles.paddingTop || '0');
    const [paddingBottom, setPaddingBottom] = useState(parsedStyles.paddingBottom || '0');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const newStyles = {
            backgroundColor: bgColor,
            backgroundImage: bgImage,
            paddingTop,
            paddingBottom
        };
        await updateBlockStyles(block.id, JSON.stringify(newStyles));
        onSaved();
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSave} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4">

            <div className="bg-indigo-50 p-4 border border-indigo-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-indigo-500 flex items-center justify-center text-white text-[10px]"><span className="leading-none">🎨</span></div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-800">Fondo y Color (Background)</label>
                </div>

                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Color Hexadecimal</label>
                    <input type="text" placeholder="#f25c54 o transparent" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">URL Imagen de Fondo</label>
                    <input type="text" placeholder="https://ejemplo.com/imagen.jpg" value={bgImage} onChange={e => setBgImage(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                </div>
            </div>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-slate-500 flex items-center justify-center text-white text-[10px]"><span className="leading-none">↕</span></div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Espaciado y Márgenes</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Relleno Sup. (rem)</label>
                        <input type="number" value={paddingTop} onChange={e => setPaddingTop(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Relleno Inf. (rem)</label>
                        <input type="number" value={paddingBottom} onChange={e => setPaddingBottom(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                    </div>
                </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold text-xs uppercase hover:bg-indigo-700 transition-colors shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                {isSaving ? <span className="animate-spin text-lg">⚙</span> : <span>Aplicar Estilos</span>}
            </button>
        </form>
    );
}

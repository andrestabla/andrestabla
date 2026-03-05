import { useEffect, useState } from 'react';
import { updateBlockStyles } from '../actions';
import { Palette, Baseline, Type } from 'lucide-react';
import { inferBackgroundMediaType, normalizeBackgroundMediaType } from '@/lib/backgroundVideo';

function getParsedStyles(styles: unknown) {
    if (!styles) return {};
    try {
        return JSON.parse(String(styles));
    } catch (_error) {
        return {};
    }
}

function getHydratedStyleState(sourceBlock: any) {
    const parsedStyles = getParsedStyles(sourceBlock?.styles);
    const normalizedMediaType = normalizeBackgroundMediaType(parsedStyles.backgroundMediaType);
    const backgroundMediaType = normalizedMediaType === 'auto'
        ? inferBackgroundMediaType(parsedStyles)
        : normalizedMediaType;

    return {
        bgColor: parsedStyles.backgroundColor || '',
        bgImage: parsedStyles.backgroundImage || '',
        bgVideo: parsedStyles.backgroundVideo || '',
        bgMediaType: backgroundMediaType,
        overlayColor: parsedStyles.backgroundOverlayColor || '#000000',
        overlayOpacity: String(parsedStyles.backgroundOverlayOpacity ?? '0'),
        linkButtonBg: parsedStyles.linkButtonBg || '',
        linkButtonText: parsedStyles.linkButtonText || '',
        linkButtonBorder: parsedStyles.linkButtonBorder || '',
        linkButtonHoverBg: parsedStyles.linkButtonHoverBg || '',
        linkButtonHoverText: parsedStyles.linkButtonHoverText || '',
        linkButtonHoverBorder: parsedStyles.linkButtonHoverBorder || '',
        contactButtonBg: parsedStyles.contactButtonBg || '',
        contactButtonBorder: parsedStyles.contactButtonBorder || '',
        contactButtonIcon: parsedStyles.contactButtonIcon || '',
        contactButtonText: parsedStyles.contactButtonText || '',
        contactButtonHoverBg: parsedStyles.contactButtonHoverBg || '',
        contactButtonHoverBorder: parsedStyles.contactButtonHoverBorder || '',
        contactButtonHoverIcon: parsedStyles.contactButtonHoverIcon || '',
        contactButtonHoverText: parsedStyles.contactButtonHoverText || '',
        paddingTop: parsedStyles.paddingTop || '0',
        paddingBottom: parsedStyles.paddingBottom || '0',
        textColor: parsedStyles.textColor || '',
        titleColor: parsedStyles.titleColor || '',
        fontSize: parsedStyles.fontSize || '1',
        fontFamily: parsedStyles.fontFamily || '',
    };
}

export default function AdvancedStyleInspector({ block, onSaved }: { block: any, onSaved: () => void }) {
    const [isSaving, setIsSaving] = useState(false);

    const initialState = getHydratedStyleState(block);

    const [bgColor, setBgColor] = useState(initialState.bgColor);
    const [bgImage, setBgImage] = useState(initialState.bgImage);
    const [bgVideo, setBgVideo] = useState(initialState.bgVideo);
    const [bgMediaType, setBgMediaType] = useState(initialState.bgMediaType);
    const [overlayColor, setOverlayColor] = useState(initialState.overlayColor);
    const [overlayOpacity, setOverlayOpacity] = useState(initialState.overlayOpacity);
    const [linkButtonBg, setLinkButtonBg] = useState(initialState.linkButtonBg);
    const [linkButtonText, setLinkButtonText] = useState(initialState.linkButtonText);
    const [linkButtonBorder, setLinkButtonBorder] = useState(initialState.linkButtonBorder);
    const [linkButtonHoverBg, setLinkButtonHoverBg] = useState(initialState.linkButtonHoverBg);
    const [linkButtonHoverText, setLinkButtonHoverText] = useState(initialState.linkButtonHoverText);
    const [linkButtonHoverBorder, setLinkButtonHoverBorder] = useState(initialState.linkButtonHoverBorder);
    const [contactButtonBg, setContactButtonBg] = useState(initialState.contactButtonBg);
    const [contactButtonBorder, setContactButtonBorder] = useState(initialState.contactButtonBorder);
    const [contactButtonIcon, setContactButtonIcon] = useState(initialState.contactButtonIcon);
    const [contactButtonText, setContactButtonText] = useState(initialState.contactButtonText);
    const [contactButtonHoverBg, setContactButtonHoverBg] = useState(initialState.contactButtonHoverBg);
    const [contactButtonHoverBorder, setContactButtonHoverBorder] = useState(initialState.contactButtonHoverBorder);
    const [contactButtonHoverIcon, setContactButtonHoverIcon] = useState(initialState.contactButtonHoverIcon);
    const [contactButtonHoverText, setContactButtonHoverText] = useState(initialState.contactButtonHoverText);
    const [paddingTop, setPaddingTop] = useState(initialState.paddingTop);
    const [paddingBottom, setPaddingBottom] = useState(initialState.paddingBottom);
    const [textColor, setTextColor] = useState(initialState.textColor);
    const [titleColor, setTitleColor] = useState(initialState.titleColor);
    const [fontSize, setFontSize] = useState(initialState.fontSize);
    const [fontFamily, setFontFamily] = useState(initialState.fontFamily);
    const overlayOpacityNumber = Number(overlayOpacity);
    const safeOverlayOpacity = Number.isFinite(overlayOpacityNumber)
        ? Math.max(0, Math.min(100, overlayOpacityNumber))
        : 0;

    useEffect(() => {
        const nextState = getHydratedStyleState(block);
        setBgColor(nextState.bgColor);
        setBgImage(nextState.bgImage);
        setBgVideo(nextState.bgVideo);
        setBgMediaType(nextState.bgMediaType);
        setOverlayColor(nextState.overlayColor);
        setOverlayOpacity(nextState.overlayOpacity);
        setLinkButtonBg(nextState.linkButtonBg);
        setLinkButtonText(nextState.linkButtonText);
        setLinkButtonBorder(nextState.linkButtonBorder);
        setLinkButtonHoverBg(nextState.linkButtonHoverBg);
        setLinkButtonHoverText(nextState.linkButtonHoverText);
        setLinkButtonHoverBorder(nextState.linkButtonHoverBorder);
        setContactButtonBg(nextState.contactButtonBg);
        setContactButtonBorder(nextState.contactButtonBorder);
        setContactButtonIcon(nextState.contactButtonIcon);
        setContactButtonText(nextState.contactButtonText);
        setContactButtonHoverBg(nextState.contactButtonHoverBg);
        setContactButtonHoverBorder(nextState.contactButtonHoverBorder);
        setContactButtonHoverIcon(nextState.contactButtonHoverIcon);
        setContactButtonHoverText(nextState.contactButtonHoverText);
        setPaddingTop(nextState.paddingTop);
        setPaddingBottom(nextState.paddingBottom);
        setTextColor(nextState.textColor);
        setTitleColor(nextState.titleColor);
        setFontSize(nextState.fontSize);
        setFontFamily(nextState.fontFamily);
    }, [block]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const newStyles = {
            backgroundColor: bgColor,
            backgroundMediaType: bgMediaType,
            backgroundImage: bgImage,
            backgroundVideo: bgVideo,
            backgroundOverlayColor: overlayColor,
            backgroundOverlayOpacity: String(safeOverlayOpacity),
            linkButtonBg,
            linkButtonText,
            linkButtonBorder,
            linkButtonHoverBg,
            linkButtonHoverText,
            linkButtonHoverBorder,
            contactButtonBg,
            contactButtonBorder,
            contactButtonIcon,
            contactButtonText,
            contactButtonHoverBg,
            contactButtonHoverBorder,
            contactButtonHoverIcon,
            contactButtonHoverText,
            paddingTop,
            paddingBottom,
            textColor,
            titleColor,
            fontSize,
            fontFamily
        };
        await updateBlockStyles(block.id, JSON.stringify(newStyles));
        onSaved();
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSave} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4">

            {/* fondo y espaciado existente */}
            <div className="bg-indigo-50 p-4 border border-indigo-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-indigo-500 flex items-center justify-center text-white text-[10px]"><Palette size={10} /></div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-800">Fondo y Color (Background)</label>
                </div>

                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Color Hexadecimal</label>
                    <input type="text" placeholder="#f25c54 o transparent" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Tipo de Fondo</label>
                    <select
                        value={bgMediaType}
                        onChange={e => setBgMediaType(e.target.value as 'image' | 'video')}
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">URL Imagen de Fondo</label>
                    <input
                        type="text"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={bgImage}
                        onChange={e => setBgImage(e.target.value)}
                        disabled={bgMediaType !== 'image'}
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">URL Video de Fondo</label>
                    <input
                        type="text"
                        placeholder="https://...mp4 o YouTube/Vimeo URL"
                        value={bgVideo}
                        onChange={e => setBgVideo(e.target.value)}
                        disabled={bgMediaType !== 'video'}
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Color de Capa</label>
                    <input
                        type="text"
                        placeholder="#000000"
                        value={overlayColor}
                        onChange={e => setOverlayColor(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                        Transparencia de Capa (%)
                    </label>
                    <div className="grid grid-cols-[1fr_90px] gap-2">
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={safeOverlayOpacity}
                            onChange={e => setOverlayOpacity(e.target.value)}
                            className="w-full"
                        />
                        <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={overlayOpacity}
                            onChange={e => setOverlayOpacity(e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-cyan-50 p-4 border border-cyan-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-cyan-500 flex items-center justify-center text-white text-[10px]">◎</div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-800">Botones de Enlace</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="Fondo" value={linkButtonBg} onChange={e => setLinkButtonBg(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Texto" value={linkButtonText} onChange={e => setLinkButtonText(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Borde" value={linkButtonBorder} onChange={e => setLinkButtonBorder(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Hover fondo" value={linkButtonHoverBg} onChange={e => setLinkButtonHoverBg(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Hover texto" value={linkButtonHoverText} onChange={e => setLinkButtonHoverText(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Hover borde" value={linkButtonHoverBorder} onChange={e => setLinkButtonHoverBorder(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                </div>
            </div>

            <div className="bg-rose-50 p-4 border border-rose-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-rose-500 flex items-center justify-center text-white text-[10px]">☎</div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-800">Botones Teléfono y Email</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Fondo normal" value={contactButtonBg} onChange={e => setContactButtonBg(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Borde normal" value={contactButtonBorder} onChange={e => setContactButtonBorder(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Ícono normal" value={contactButtonIcon} onChange={e => setContactButtonIcon(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Texto normal" value={contactButtonText} onChange={e => setContactButtonText(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Fondo hover" value={contactButtonHoverBg} onChange={e => setContactButtonHoverBg(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Borde hover" value={contactButtonHoverBorder} onChange={e => setContactButtonHoverBorder(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Ícono hover" value={contactButtonHoverIcon} onChange={e => setContactButtonHoverIcon(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                    <input type="text" placeholder="Texto hover" value={contactButtonHoverText} onChange={e => setContactButtonHoverText(e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg" />
                </div>
            </div>

            {/* NUEVA SECCIÓN: TIPOGRAFÍA Y TEXTO */}
            <div className="bg-emerald-50 p-4 border border-emerald-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-white text-[10px]"><Type size={10} /></div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Tipografía y Texto</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Color Texto</label>
                        <input type="text" placeholder="#ffffff" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Color Títulos</label>
                        <input type="text" placeholder="#ffffff" value={titleColor} onChange={e => setTitleColor(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Tamaño (rem)</label>
                        <input type="number" step="0.1" value={fontSize} onChange={e => setFontSize(e.target.value)} className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Fuente</label>
                        <select
                            value={fontFamily}
                            onChange={e => setFontFamily(e.target.value)}
                            className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white"
                        >
                            <option value="">Por defecto</option>
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Playfair Display">Playfair Display</option>
                            <option value="Outfit">Outfit</option>
                            <option value="DM Sans">DM Sans</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-slate-500 flex items-center justify-center text-white text-[10px]"><Baseline size={10} /></div>
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

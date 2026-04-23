import { useEffect, useState } from 'react';
import { updateBlockStyles } from '../actions';
import { Palette, Baseline, Type } from 'lucide-react';
import { inferBackgroundMediaType, normalizeBackgroundMediaType } from '@/lib/backgroundVideo';

const QUICK_COLOR_PRESETS = [
    '#FFFFFF',
    '#F8FAFC',
    '#E2E8F0',
    '#94A3B8',
    '#64748B',
    '#334155',
    '#0F172A',
    '#000000',
    '#54B6F2',
    '#4F46E5',
    '#22C55E',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
];

function normalizeColorToken(value: string): string {
    return String(value || '').trim().toLowerCase();
}

function isTransparent(value: string): boolean {
    return normalizeColorToken(value) === 'transparent';
}

function getSwatchStyle(color: string) {
    if (isTransparent(color)) {
        return {
            backgroundImage:
                'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0',
            backgroundColor: '#ffffff',
        };
    }
    return { backgroundColor: color };
}

function ColorQuickField({
    label,
    value,
    onChange,
    placeholder,
    includeTransparent = false,
}: {
    label: string;
    value: string;
    onChange: (next: string) => void;
    placeholder?: string;
    includeTransparent?: boolean;
}) {
    const options = includeTransparent ? ['transparent', ...QUICK_COLOR_PRESETS] : QUICK_COLOR_PRESETS;
    const selected = normalizeColorToken(value);

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">{label}</label>
            <input
                type="text"
                placeholder={placeholder || '#ffffff'}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-invisible">
                {options.map((color) => {
                    const active = normalizeColorToken(color) === selected;
                    return (
                        <button
                            key={`${label}-${color}`}
                            type="button"
                            title={color}
                            aria-label={`${label}: ${color}`}
                            onClick={() => onChange(color)}
                            className={`shrink-0 w-6 h-6 rounded-md border transition-all ${active ? 'border-indigo-600 ring-1 ring-indigo-500' : 'border-slate-300 hover:border-slate-400'}`}
                            style={getSwatchStyle(color)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

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
        bgPosition: parsedStyles.backgroundPosition || '',
        bgPositionMobile: parsedStyles.backgroundPositionMobile || '',
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
    const [bgPosition, setBgPosition] = useState(initialState.bgPosition);
    const [bgPositionMobile, setBgPositionMobile] = useState(initialState.bgPositionMobile);
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
        setBgPosition(nextState.bgPosition);
        setBgPositionMobile(nextState.bgPositionMobile);
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
            backgroundPosition: bgPosition,
            backgroundPositionMobile: bgPositionMobile,
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

                <ColorQuickField
                    label="Color Hexadecimal"
                    value={bgColor}
                    onChange={setBgColor}
                    placeholder="#f25c54 o transparent"
                    includeTransparent
                />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Enfoque Desktop</label>
                        <input
                            type="text"
                            placeholder="center o 72% center"
                            value={bgPosition}
                            onChange={e => setBgPosition(e.target.value)}
                            className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Enfoque Mobile</label>
                        <input
                            type="text"
                            placeholder="82% center"
                            value={bgPositionMobile}
                            onChange={e => setBgPositionMobile(e.target.value)}
                            className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <ColorQuickField
                    label="Color de Capa"
                    value={overlayColor}
                    onChange={setOverlayColor}
                    placeholder="#000000"
                    includeTransparent
                />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ColorQuickField label="Fondo" value={linkButtonBg} onChange={setLinkButtonBg} placeholder="#18181b" includeTransparent />
                    <ColorQuickField label="Texto" value={linkButtonText} onChange={setLinkButtonText} placeholder="#94a3b8" />
                    <ColorQuickField label="Borde" value={linkButtonBorder} onChange={setLinkButtonBorder} placeholder="transparent" includeTransparent />
                    <ColorQuickField label="Hover fondo" value={linkButtonHoverBg} onChange={setLinkButtonHoverBg} placeholder="#ffffff" includeTransparent />
                    <ColorQuickField label="Hover texto" value={linkButtonHoverText} onChange={setLinkButtonHoverText} placeholder="#000000" />
                    <ColorQuickField label="Hover borde" value={linkButtonHoverBorder} onChange={setLinkButtonHoverBorder} placeholder="transparent" includeTransparent />
                </div>
            </div>

            <div className="bg-rose-50 p-4 border border-rose-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-rose-500 flex items-center justify-center text-white text-[10px]">☎</div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-800">Botones Teléfono y Email</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ColorQuickField label="Fondo normal" value={contactButtonBg} onChange={setContactButtonBg} placeholder="transparent" includeTransparent />
                    <ColorQuickField label="Borde normal" value={contactButtonBorder} onChange={setContactButtonBorder} placeholder="#27272a" />
                    <ColorQuickField label="Ícono normal" value={contactButtonIcon} onChange={setContactButtonIcon} placeholder="#94a3b8" />
                    <ColorQuickField label="Texto normal" value={contactButtonText} onChange={setContactButtonText} placeholder="#cbd5e1" />
                    <ColorQuickField label="Fondo hover" value={contactButtonHoverBg} onChange={setContactButtonHoverBg} placeholder="var(--brand)" includeTransparent />
                    <ColorQuickField label="Borde hover" value={contactButtonHoverBorder} onChange={setContactButtonHoverBorder} placeholder="var(--brand)" includeTransparent />
                    <ColorQuickField label="Ícono hover" value={contactButtonHoverIcon} onChange={setContactButtonHoverIcon} placeholder="#ffffff" />
                    <ColorQuickField label="Texto hover" value={contactButtonHoverText} onChange={setContactButtonHoverText} placeholder="#ffffff" />
                </div>
            </div>

            {/* NUEVA SECCIÓN: TIPOGRAFÍA Y TEXTO */}
            <div className="bg-emerald-50 p-4 border border-emerald-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-white text-[10px]"><Type size={10} /></div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Tipografía y Texto</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <ColorQuickField label="Color Texto" value={textColor} onChange={setTextColor} placeholder="#ffffff" />
                    <ColorQuickField label="Color Títulos" value={titleColor} onChange={setTitleColor} placeholder="#ffffff" />
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

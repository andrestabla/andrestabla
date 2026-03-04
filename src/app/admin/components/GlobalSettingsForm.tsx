import { useState } from 'react';
import { updateGlobalSettings } from './actions';
import { Palette, Baseline, Image as ImageIcon, Loader2, Navigation, Plus, Trash2 } from 'lucide-react';

// Small inline color swatch + hex input
function ColorField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
    return (
        <div className="flex items-center gap-2 py-1.5">
            <input
                type="color"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 p-0.5 shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 leading-none mb-0.5">{label}</div>
                {hint && <div className="text-[9px] text-slate-400 leading-none">{hint}</div>}
            </div>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-[82px] text-[10px] font-mono p-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 uppercase shrink-0"
            />
        </div>
    );
}

export default function GlobalSettingsForm({
    settings,
    onSaved,
    anchorOptions = [],
}: {
    settings: any;
    onSaved: () => void;
    anchorOptions?: { label: string; href: string }[];
}) {
    const [isSaving, setIsSaving] = useState(false);

    let parsedStyles: any = {
        primaryColor: '#f25c54',
        secondaryColor: '#18181b',
        accentColor: '#6366f1',
        buttonBg: '#f25c54',
        buttonHover: '#d94a42',
        textColor: '#cbd5e1',
        headingColor: '#ffffff',
        fontFamily: 'Inter',
        logoUrl: '',
        loaderEnabled: true,
        footerStyle: 'minimal',
        footerText: 'Powered by NodeBuilder™',
        footerBg: '#09090b',
        footerBorder: '#18181b',
        footerTextColor: '#71717a',
        footerAccentColor: '#f25c54',
        navLinks: [
            { label: 'Inicio', href: '#' },
            { label: 'Experiencia', href: '#experiencia' },
            { label: 'Educación', href: '#educacion' },
            { label: 'Cursos', href: '#cursos' },
        ] as { label: string; href: string }[]
    };

    if (settings && settings.globalStyles) {
        try {
            const parsed = JSON.parse(settings.globalStyles);
            parsedStyles = { ...parsedStyles, ...parsed };
        } catch (_error) { }
    }

    const [primaryColor, setPrimaryColor] = useState(parsedStyles.primaryColor);
    const [secondaryColor, setSecondaryColor] = useState(parsedStyles.secondaryColor);
    const [accentColor, setAccentColor] = useState(parsedStyles.accentColor);
    const [buttonBg, setButtonBg] = useState(parsedStyles.buttonBg);
    const [buttonHover, setButtonHover] = useState(parsedStyles.buttonHover);
    const [textColor, setTextColor] = useState(parsedStyles.textColor);
    const [headingColor, setHeadingColor] = useState(parsedStyles.headingColor);
    const [fontFamily, setFontFamily] = useState(parsedStyles.fontFamily);
    const [logoUrl, setLogoUrl] = useState(parsedStyles.logoUrl);
    const [loaderEnabled, setLoaderEnabled] = useState(parsedStyles.loaderEnabled);
    const [footerStyle, setFooterStyle] = useState(parsedStyles.footerStyle);
    const [footerText, setFooterText] = useState(parsedStyles.footerText);
    const [footerBg, setFooterBg] = useState(parsedStyles.footerBg);
    const [footerBorder, setFooterBorder] = useState(parsedStyles.footerBorder);
    const [footerTextColorValue, setFooterTextColorValue] = useState(parsedStyles.footerTextColor);
    const [footerAccentColor, setFooterAccentColor] = useState(parsedStyles.footerAccentColor);
    const [navLinks, setNavLinks] = useState<{ label: string; href: string }[]>(parsedStyles.navLinks);
    const anchorHrefSet = new Set(anchorOptions.map((item) => item.href));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const payload = JSON.stringify({
            primaryColor, secondaryColor, accentColor,
            buttonBg, buttonHover, textColor, headingColor,
            fontFamily, logoUrl, loaderEnabled,
            footerStyle, footerText, footerBg, footerBorder, footerTextColor: footerTextColorValue, footerAccentColor,
            navLinks
        });
        await updateGlobalSettings(payload);
        setIsSaving(false);
        onSaved();
    };

    return (
        <form onSubmit={handleSave} className="p-4 flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">

            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Palette size={18} className="text-indigo-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Diseño Global</h3>
            </div>

            {/* ── PALETA DE COLORES ─────────────────────────────── */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1">
                    <Palette size={11} /> Paleta de Colores
                </p>

                <div className="divide-y divide-slate-100">
                    <ColorField label="Color Principal" value={primaryColor} onChange={setPrimaryColor} hint="Marca, acentos generales" />
                    <ColorField label="Color Secundario" value={secondaryColor} onChange={setSecondaryColor} hint="Fondos, superficies oscuras" />
                    <ColorField label="Color de Acento" value={accentColor} onChange={setAccentColor} hint="Badges, tags, highlights" />
                </div>
            </div>

            {/* ── BOTONES ──────────────────────────────────────────── */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">🔘 Botones</p>
                <div className="divide-y divide-slate-100">
                    <ColorField label="Fondo Normal" value={buttonBg} onChange={setButtonBg} hint="Estado por defecto" />
                    <ColorField label="Fondo Hover" value={buttonHover} onChange={setButtonHover} hint="Al pasar el cursor" />
                </div>

                {/* Live preview */}
                <div className="mt-4 flex gap-2">
                    <button type="button"
                        style={{ backgroundColor: buttonBg }}
                        className="flex-1 py-2 rounded-lg text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = buttonHover)}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = buttonBg)}
                    >
                        Vista Previa
                    </button>
                    <div className="flex-1 py-2 border border-slate-200 rounded-lg text-center text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: buttonBg }}>
                        Outline
                    </div>
                </div>
            </div>

            {/* ── TIPOGRAFÍA / TEXTO ───────────────────────────────── */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">✏️ Texto</p>
                <div className="divide-y divide-slate-100 mb-4">
                    <ColorField label="Color Cuerpo" value={textColor} onChange={setTextColor} hint="Párrafos y texto general" />
                    <ColorField label="Color Títulos" value={headingColor} onChange={setHeadingColor} hint="H1, H2, H3..." />
                </div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
                    <Baseline size={11} /> Tipografía Base
                </label>
                <select
                    value={fontFamily}
                    onChange={e => setFontFamily(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                >
                    <option value="Inter">Inter — Moderna y Limpia</option>
                    <option value="Roboto">Roboto — Estándar Corporativa</option>
                    <option value="Playfair Display">Playfair Display — Elegante Serif</option>
                    <option value="Outfit">Outfit — Geométrica Tech</option>
                    <option value="DM Sans">DM Sans — Amigable Startup</option>
                </select>
            </div>

            {/* ── LOGO ─────────────────────────────────────────────── */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1">
                    <ImageIcon size={11} /> Logotipo de Navegación
                </label>
                <input
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="URL del Logo (https://...)"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 mb-2"
                />
                {logoUrl && (
                    <div className="p-3 bg-slate-900 rounded-lg flex items-center justify-center">
                        <img src={logoUrl} alt="Logo Preview" className="max-h-10 object-contain" />
                    </div>
                )}
            </div>

            {/* ── LOADER ───────────────────────────────────────────── */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-800 flex items-center gap-1">
                        <Loader2 size={11} /> Loader Inicial
                    </label>
                    <p className="text-[9px] text-slate-400 mt-0.5">Animación al entrar al sitio.</p>
                </div>
                <input
                    type="checkbox"
                    checked={loaderEnabled}
                    onChange={e => setLoaderEnabled(e.target.checked)}
                    className="w-5 h-5 rounded text-indigo-600"
                />
            </div>

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block">
                    Pie de Página
                </label>

                <div className="space-y-3">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Estilo</p>
                        <select
                            value={footerStyle}
                            onChange={e => setFooterStyle(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                        >
                            <option value="minimal">Minimal</option>
                            <option value="centered">Centered</option>
                            <option value="split">Split</option>
                        </select>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Texto Secundario</p>
                        <input
                            type="text"
                            value={footerText}
                            onChange={e => setFooterText(e.target.value)}
                            placeholder="Powered by NodeBuilder™"
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="divide-y divide-slate-100">
                        <ColorField label="Fondo" value={footerBg} onChange={setFooterBg} />
                        <ColorField label="Borde Superior" value={footerBorder} onChange={setFooterBorder} />
                        <ColorField label="Texto" value={footerTextColorValue} onChange={setFooterTextColorValue} />
                        <ColorField label="Acento" value={footerAccentColor} onChange={setFooterAccentColor} />
                    </div>

                    <div
                        className="border rounded-lg p-3 text-center text-[10px] uppercase tracking-widest font-bold"
                        style={{ backgroundColor: footerBg, borderColor: footerBorder, color: footerTextColorValue }}
                    >
                        Vista previa: {footerStyle} <span style={{ color: footerAccentColor }}>•</span> {footerText || 'Texto secundario'}
                    </div>
                </div>
            </div>

            {/* ── MENÚ NAV ─────────────────────────────────────────── */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                        <Navigation size={11} /> Menú de Navegación
                    </label>
                    <button type="button"
                        onClick={() => setNavLinks([...navLinks, { label: 'Nuevo', href: anchorOptions[0]?.href || '#' }])}
                        className="flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white text-[9px] font-bold rounded-lg hover:bg-indigo-700"
                    >
                        <Plus size={10} /> Añadir
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {navLinks.map((link, idx) => (
                        <div key={idx} className="flex gap-1.5 items-center">
                            <input type="text" value={link.label}
                                onChange={e => { const u = [...navLinks]; u[idx] = { ...u[idx], label: e.target.value }; setNavLinks(u); }}
                                placeholder="Nombre"
                                className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                            />
                            <div className="flex-1 flex flex-col gap-1">
                                <select
                                    value={anchorHrefSet.has(link.href) ? link.href : '__custom__'}
                                    onChange={e => {
                                        const selected = e.target.value;
                                        const u = [...navLinks];
                                        if (selected === '__custom__') {
                                            if (anchorHrefSet.has(u[idx].href)) u[idx] = { ...u[idx], href: '' };
                                        } else {
                                            u[idx] = { ...u[idx], href: selected };
                                        }
                                        setNavLinks(u);
                                    }}
                                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500"
                                >
                                    {anchorOptions.map((anchor) => (
                                        <option key={anchor.href} value={anchor.href}>{anchor.label}</option>
                                    ))}
                                    <option value="__custom__">URL personalizada...</option>
                                </select>

                                {!anchorHrefSet.has(link.href) && (
                                    <input
                                        type="text"
                                        value={link.href}
                                        onChange={e => { const u = [...navLinks]; u[idx] = { ...u[idx], href: e.target.value }; setNavLinks(u); }}
                                        placeholder="#ancla o URL"
                                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                                    />
                                )}
                            </div>
                            <button type="button"
                                onClick={() => setNavLinks(navLinks.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-600 p-1">
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" disabled={isSaving}
                className="w-full bg-indigo-600 text-white p-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-md mt-2">
                {isSaving ? 'Guardando...' : 'Guardar y Publicar Diseño'}
            </button>
        </form>
    );
}

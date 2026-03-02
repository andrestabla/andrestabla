import { useState } from 'react';
import { updateGlobalSettings } from './actions';
import { Palette, Baseline, Image as ImageIcon, Loader2, Navigation, Plus, Trash2 } from 'lucide-react';

export default function GlobalSettingsForm({ settings, onSaved }: { settings: any, onSaved: () => void }) {
    const [isSaving, setIsSaving] = useState(false);

    let parsedStyles = {
        primaryColor: '#4f46e5',
        fontFamily: 'Inter',
        logoUrl: '',
        loaderEnabled: true,
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
        } catch (e) { }
    }

    const [primaryColor, setPrimaryColor] = useState(parsedStyles.primaryColor);
    const [fontFamily, setFontFamily] = useState(parsedStyles.fontFamily);
    const [logoUrl, setLogoUrl] = useState(parsedStyles.logoUrl);
    const [loaderEnabled, setLoaderEnabled] = useState(parsedStyles.loaderEnabled);
    const [navLinks, setNavLinks] = useState<{ label: string; href: string }[]>(parsedStyles.navLinks);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const payload = JSON.stringify({ primaryColor, fontFamily, logoUrl, loaderEnabled, navLinks });
        await updateGlobalSettings(payload);
        setIsSaving(false);
        onSaved();
    };

    return (
        <form onSubmit={handleSave} className="p-4 flex flex-col gap-6 animate-in fade-in slide-in-from-left-4">

            <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-200">
                <Palette size={20} className="text-indigo-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Diseño Global</h3>
            </div>

            {/* Colors */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1"><Palette size={12} /> Color Principal (Acentos)</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                        type="text"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="flex-1 text-xs font-mono p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 uppercase"
                    />
                </div>
            </div>

            {/* Typography */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1"><Baseline size={12} /> Tipografía Base</label>
                <select
                    value={fontFamily}
                    onChange={e => setFontFamily(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white"
                >
                    <option value="Inter">Inter (Moderna, Limpia)</option>
                    <option value="Roboto">Roboto (Estándar, Corporativa)</option>
                    <option value="Playfair Display">Playfair Display (Elegante, Serif)</option>
                    <option value="Outfit">Outfit (Geométrica, Tech)</option>
                    <option value="DM Sans">DM Sans (Amigable, Startup)</option>
                </select>
            </div>

            {/* Logo */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1"><ImageIcon size={12} /> Logotipo de Navegación</label>
                <input
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="URL del Logo (Ej: https://...logo.png)"
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 mb-3"
                />
                {logoUrl && (
                    <div className="p-4 bg-slate-900 rounded-lg flex items-center justify-center">
                        <img src={logoUrl} alt="Logo Preview" className="max-h-12 object-contain" />
                    </div>
                )}
            </div>

            {/* Loader */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-800 mb-1 flex items-center gap-1"><Loader2 size={12} /> Loader Inicial</label>
                    <p className="text-[9px] text-slate-500">Mostrar animación de carga al entrar al sitio.</p>
                </div>
                <input
                    type="checkbox"
                    checked={loaderEnabled}
                    onChange={e => setLoaderEnabled(e.target.checked)}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
            </div>

            {/* Nav Links Editor */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                        <Navigation size={12} /> Menú de Navegación
                    </label>
                    <button
                        type="button"
                        onClick={() => setNavLinks([...navLinks, { label: 'Nuevo Enlace', href: '#' }])}
                        className="flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white text-[9px] font-bold rounded-lg hover:bg-indigo-700"
                    >
                        <Plus size={10} /> Añadir
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {navLinks.map((link, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={link.label}
                                onChange={e => {
                                    const updated = [...navLinks];
                                    updated[idx] = { ...updated[idx], label: e.target.value };
                                    setNavLinks(updated);
                                }}
                                placeholder="Etiqueta"
                                className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                            />
                            <input
                                type="text"
                                value={link.href}
                                onChange={e => {
                                    const updated = [...navLinks];
                                    updated[idx] = { ...updated[idx], href: e.target.value };
                                    setNavLinks(updated);
                                }}
                                placeholder="URL o #ancla"
                                className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setNavLinks(navLinks.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-600 p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-4">
                {isSaving ? 'Aplicando Configuración...' : 'Guardar y Publicar Diseño'}
            </button>
        </form>
    );
}

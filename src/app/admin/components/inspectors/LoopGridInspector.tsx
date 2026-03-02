'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type LoopItem = {
    title: string;
    category: string;
    date: string;
    excerpt: string;
    image: string;
    href?: string;
};

const DEFAULT_BLOG_ITEMS: LoopItem[] = [
    {
        title: 'El Futuro del Desarrollo Web',
        category: 'Tecnología',
        date: 'Mar 02, 2026',
        excerpt: 'Explorando estrategias modernas con Next.js y arquitecturas híbridas.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
    {
        title: 'Minimalismo en Diseño UI',
        category: 'Diseño',
        date: 'Feb 18, 2026',
        excerpt: 'Cómo reducir fricción visual y mejorar la conversión con layouts claros.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
    {
        title: 'SEO Técnico para Portafolios',
        category: 'Marketing',
        date: 'Ene 30, 2026',
        excerpt: 'Checklist práctico para posicionar tu sitio de servicios profesionales.',
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
];

const DEFAULT_PORTFOLIO_ITEMS: LoopItem[] = [
    {
        title: 'Rediseño de Plataforma SaaS',
        category: 'UX/UI',
        date: '2026',
        excerpt: 'Sistema de diseño, landing y panel administrativo para producto B2B.',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
    {
        title: 'App de Gestión Comercial',
        category: 'App',
        date: '2025',
        excerpt: 'Aplicación de ventas con panel de analítica y flujos automatizados.',
        image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
    {
        title: 'Portal Corporativo Multilingüe',
        category: 'Web',
        date: '2025',
        excerpt: 'Sitio institucional con CMS, performance optimizada y SEO internacional.',
        image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=600&auto=format&fit=crop',
        href: '#',
    },
];

const getDefaultItems = (postType: string): LoopItem[] =>
    postType === 'portfolio' ? DEFAULT_PORTFOLIO_ITEMS : DEFAULT_BLOG_ITEMS;

export default function LoopGridInspector({
    initialData,
    onSave,
    isSaving,
}: {
    initialData: any;
    onSave: (data: any) => void;
    isSaving: boolean;
}) {
    const initialPostType = initialData.postType || 'blog';

    const [postType, setPostType] = useState(initialPostType);
    const [columns, setColumns] = useState(initialData.columns || 'grid-cols-1 md:grid-cols-3');
    const [limit, setLimit] = useState(initialData.limit || 3);
    const [showImage, setShowImage] = useState(initialData.showImage !== undefined ? initialData.showImage : true);
    const [items, setItems] = useState<LoopItem[]>(
        Array.isArray(initialData.items) && initialData.items.length > 0
            ? initialData.items
            : getDefaultItems(initialPostType)
    );

    const handleItemChange = (index: number, field: keyof LoopItem, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                title: postType === 'portfolio' ? 'Nuevo Proyecto' : 'Nuevo Artículo',
                category: postType === 'portfolio' ? 'Web' : 'General',
                date: '',
                excerpt: '',
                image: '',
                href: '#',
            },
        ]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        const sanitizedItems = items
            .map((item) => ({
                title: (item.title || '').trim(),
                category: (item.category || '').trim() || 'General',
                date: (item.date || '').trim(),
                excerpt: (item.excerpt || '').trim(),
                image: (item.image || '').trim(),
                href: (item.href || '').trim(),
            }))
            .filter((item) => item.title || item.excerpt || item.image);

        onSave({ postType, columns, limit, showImage, items: sanitizedItems });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl mb-1">
                <p className="text-[10px] text-indigo-700 font-medium">
                    Este bloque ahora se edita desde aquí: agrega, modifica y elimina artículos/proyectos.
                </p>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fuente de Datos</label>
                <select
                    value={postType}
                    onChange={e => setPostType(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white font-bold"
                >
                    <option value="blog">Entradas de Blog</option>
                    <option value="portfolio">Proyectos de Portafolio</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Columnas</label>
                    <select value={columns} onChange={e => setColumns(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white">
                        <option value="grid-cols-1 md:grid-cols-2">2 (Desktop)</option>
                        <option value="grid-cols-1 md:grid-cols-3">3 (Estándar)</option>
                        <option value="grid-cols-2 md:grid-cols-4">4 (Denso)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Límite a mostrar</label>
                    <input
                        type="number"
                        value={limit}
                        onChange={e => setLimit(Math.max(1, parseInt(e.target.value || '1', 10) || 1))}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs"
                        min={1}
                        max={24}
                    />
                </div>
            </div>

            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">
                <input type="checkbox" checked={showImage} onChange={e => setShowImage(e.target.checked)} className="rounded border-slate-300" />
                Mostrar Imagen de Portada
            </label>

            <div className="mt-1 border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    {postType === 'portfolio' ? 'Proyectos' : 'Artículos'}
                </label>

                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="relative bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                            <button onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1" type="button">
                                <Trash2 size={14} />
                            </button>

                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Título</label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={e => handleItemChange(idx, 'title', e.target.value)}
                                className="w-full border border-slate-200 rounded-md p-2 text-xs"
                                placeholder="Título"
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Categoría</label>
                                    <input
                                        type="text"
                                        value={item.category}
                                        onChange={e => handleItemChange(idx, 'category', e.target.value)}
                                        className="w-full border border-slate-200 rounded-md p-2 text-xs"
                                        placeholder="Categoría"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Fecha</label>
                                    <input
                                        type="text"
                                        value={item.date}
                                        onChange={e => handleItemChange(idx, 'date', e.target.value)}
                                        className="w-full border border-slate-200 rounded-md p-2 text-xs"
                                        placeholder="Mar 2026"
                                    />
                                </div>
                            </div>

                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Resumen</label>
                            <textarea
                                value={item.excerpt}
                                onChange={e => handleItemChange(idx, 'excerpt', e.target.value)}
                                className="w-full border border-slate-200 rounded-md p-2 text-xs min-h-16"
                                placeholder="Descripción corta..."
                            />

                            <div className="grid grid-cols-1 gap-2">
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">URL Imagen</label>
                                    <input
                                        type="text"
                                        value={item.image}
                                        onChange={e => handleItemChange(idx, 'image', e.target.value)}
                                        className="w-full border border-slate-200 rounded-md p-2 text-xs font-mono"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Link destino (Opcional)</label>
                                    <input
                                        type="text"
                                        value={item.href || ''}
                                        onChange={e => handleItemChange(idx, 'href', e.target.value)}
                                        className="w-full border border-slate-200 rounded-md p-2 text-xs"
                                        placeholder="/blog/mi-post o https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addItem}
                    type="button"
                    className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                    <Plus size={14} /> {postType === 'portfolio' ? 'Añadir Proyecto' : 'Añadir Artículo'}
                </button>
            </div>

            <button onClick={handleSave} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest mt-3 hover:bg-slate-800 disabled:opacity-50 shadow-md">
                {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

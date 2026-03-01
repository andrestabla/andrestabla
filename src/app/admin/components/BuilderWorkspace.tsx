'use client';

import { useState, useEffect } from 'react';
import { updateBlockData, deleteBlock, addBlock } from './actions';
import { Trash2, Settings, Plus, GripVertical, Layers, Monitor, Tablet, Smartphone, Box, Settings2, Save, ExternalLink } from 'lucide-react';
import GlobalSettingsForm from './GlobalSettingsForm';

export default function BuilderWorkspace({ page, settings }: { page: any, settings: any }) {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'palette' | 'tree' | 'settings'>('palette');
    const [previewWidth, setPreviewWidth] = useState<'100%' | '768px' | '375px'>('100%');

    // Listen for clicks inside the Iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'BLOCK_SELECTED' && event.data?.blockId) {
                setSelectedBlockId(event.data.blockId);
                setViewMode('tree'); // Ensure we are in tree view to see the inspector
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const blocks = page?.blocks || [];
    const rootBlocks = blocks.filter((b: any) => !b.parentId).sort((a: any, b: any) => a.order - b.order);
    const selectedBlock = blocks.find((b: any) => b.id === selectedBlockId);

    const forcePreviewReload = () => {
        const iframe = document.getElementById('live-preview-iframe') as HTMLIFrameElement;
        if (iframe) iframe.src = iframe.src;
    };

    // Recursive function to show tree of blocks
    const renderBlockTree = (blockLayer: any[], depth = 0) => {
        return blockLayer.map((block: any) => {
            const children = blocks.filter((b: any) => b.parentId === block.id).sort((a: any, b: any) => a.order - b.order);
            const isGrid = block.type === 'grid';

            return (
                <div key={block.id} className="relative">
                    <button
                        onClick={() => setSelectedBlockId(block.id)}
                        className={`w-full flex items-center gap-3 p-3 bg-white border ${selectedBlockId === block.id ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-slate-200'} rounded-xl hover:border-indigo-400 hover:shadow-sm transition-all text-left group mb-2`}
                        style={{ marginLeft: `${depth * 16}px`, width: `calc(100% - ${depth * 16}px)` }}
                    >
                        <div className="text-slate-300 group-hover:text-indigo-400 cursor-grab"><GripVertical size={16} /></div>

                        {isGrid && <Layers size={14} className="text-indigo-500" />}

                        <div className="flex-1">
                            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">{block.type}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                                {isGrid ? 'Contenedor de Columnas' : block.data.substring(0, 40) + '...'}
                            </div>
                        </div>
                    </button>

                    {/* Render Children Recursively */}
                    {children.length > 0 && (
                        <div className="border-l-2 border-indigo-100 ml-4 pl-2">
                            {renderBlockTree(children, depth + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="flex h-full w-full">
            <aside className="w-[400px] h-full bg-white border-r border-[#d2d2d7] flex flex-col shadow-2xl relative z-10 shrink-0">
                <div className="p-4 border-b border-[#e5e7eb] flex justify-between items-center bg-zinc-50 relative z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md"><Settings size={16} /></div>
                        <div>
                            <h2 className="font-bold text-xs tracking-tight text-slate-900 leading-none">Supreme Builder</h2>
                            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mt-1 block">Página: {page.title}</span>
                        </div>
                    </div>
                </div>

                {/* Main Sidebar Toggle */}
                {!selectedBlock && (
                    <div className="flex p-2 bg-slate-100 m-4 rounded-xl">
                        <button
                            onClick={() => setViewMode('palette')}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'palette' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Paleta de Widgets"
                        >
                            <Plus size={14} /> Insertar
                        </button>
                        <button
                            onClick={() => setViewMode('tree')}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'tree' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Árbol de Capas"
                        >
                            <Box size={14} /> Capas
                        </button>
                        <button
                            onClick={() => setViewMode('settings')}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'settings' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Diseño Global"
                        >
                            <Settings2 size={14} /> Diseño
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">

                    {viewMode === 'settings' && !selectedBlock && (
                        <GlobalSettingsForm settings={settings} onSaved={forcePreviewReload} />
                    )}

                    {viewMode === 'palette' && !selectedBlock && (
                        <div className="p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-left-4">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Estructura</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="hero" label="Portada (Hero)" defaultData={{ name: "Nuevo Bloque", role: "Tu Cargo", links: [] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="grid" label="Cuadrícula (Sección)" defaultData={{ columns: 2 }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="bento" label="Bento Grid" defaultData={{ title: "Portafolio", bentoType: "general", items: [] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="timeline" label="Línea de Vida" defaultData={{ title: "Experiencia", items: [] }} onAdded={forcePreviewReload} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1 mt-2">Básicos</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="heading" label="Encabezados" defaultData={{ text: "Nuevo Encabezado", tag: "h2" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="richtext" label="Texto a Medida" defaultData={{ title: "Título Seccion", content: "<p>Escribe algo increíble...</p>" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="button" label="Botón (CTA)" defaultData={{ text: "Haz clic aquí", link: "#", style: "primary" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="image" label="Imagen" defaultData={{ url: "", alt: "Imagen" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="video" label="Video" defaultData={{ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="divider" label="Divider (Línea)" defaultData={{ style: "solid" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="spacer" label="Spacer (Espaciador)" defaultData={{ height: "h-12" }} onAdded={forcePreviewReload} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1 mt-6">Avanzados</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="progressbar" label="Progress Bars" defaultData={{ items: [{ label: 'Habilidad', percentage: 90 }] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="form" label="Formulario" defaultData={{ title: "Contacto" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="testimonial" label="Testimonio" defaultData={{ author: "John Doe" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="social" label="Redes Sociales" defaultData={{ items: [{ network: 'linkedin', url: '#' }] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="map" label="Google Maps" defaultData={{ height: "h-[400px]" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="tabs" label="Pestañas" defaultData={{ items: [{ label: "Visión", content: "..." }] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="toggle" label="Toggle (Colapso)" defaultData={{ items: [{ title: "Pregunta", content: "..." }] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="gallery" label="Galería" defaultData={{ images: [{ url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop", alt: "Img" }] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="counter" label="Contador" defaultData={{ items: [{ label: "Proyectos", value: 150, suffix: "+" }] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="lottie" label="Lottie (Animación)" defaultData={{ jsonUrl: "https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json" }} onAdded={forcePreviewReload} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1 mt-2">Interactivos</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="accordion" label="Acordeón / FAQ" defaultData={{ title: "FAQ", items: [] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="carousel" label="Carrusel" defaultData={{ height: "h-[400px]", images: [] }} onAdded={forcePreviewReload} />
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 ml-1 mt-6">Profesionales (PRO)</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="loopgrid" label="Posts Dinámicos" defaultData={{ postType: "blog" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="portfolio" label="Portafolio" defaultData={{ columns: "grid-cols-1 md:grid-cols-3" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="pricing" label="Tablas de Precio" defaultData={{ title: "Pro", price: "$99" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="flipbox" label="Flip Boxes 3D" defaultData={{ frontTitle: "Gírame" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="hotspots" label="Hotspots (Puntos)" defaultData={{ spots: [{ id: 1, x: 50, y: 50, title: "Punto" }] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="cta" label="Call to Action" defaultData={{ title: "Únete Ahora" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="navmenu" label="Nav Menu" defaultData={{ style: "horizontal" }} onAdded={forcePreviewReload} />
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'tree' && !selectedBlock && (
                        <div className="p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-left-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Capas y Nodos</h3>

                            {blocks.length === 0 && <p className="text-xs text-slate-400 italic text-center py-8">La página está vacía.</p>}

                            <div className="space-y-1">
                                {renderBlockTree(rootBlocks)}
                            </div>
                        </div>
                    )}

                    {selectedBlock && (
                        <div className="p-4 animate-in fade-in slide-in-from-right-4">
                            <button onClick={() => setSelectedBlockId(null)} className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-4 hover:text-indigo-800 flex items-center gap-1">
                                ← Volver al Árbol Global
                            </button>

                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">Inspector: {selectedBlock.type}</h3>
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar este bloque y sus hijos?')) {
                                            await deleteBlock(selectedBlock.id);
                                            setSelectedBlockId(null);
                                            forcePreviewReload();
                                        }
                                    }}
                                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <InspectorForm
                                block={selectedBlock}
                                onSaved={forcePreviewReload}
                            />

                            {/* If exactly GRID is selected, show "ADD WIDGET INSIDE GRID" controls */}
                            {selectedBlock.type === 'grid' && (
                                <div className="mt-8 pt-6 border-t border-indigo-100 bg-indigo-50/50 -mx-4 px-4 pb-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
                                        <Layers size={14} /> Inyectar Widget dentro de Grid
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="heading" label="Encabezados (H2+)" defaultData={{ text: "Título", tag: "h3" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="richtext" label="Texto (Prose)" defaultData={{ title: "Sección", content: "<p>...</p>" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="button" label="Botón" defaultData={{ text: "Ir", style: "primary" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="image" label="Imagen" defaultData={{ url: "", alt: "Imagen" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="video" label="Video" defaultData={{ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="accordion" label="Acordeón" defaultData={{ title: "", items: [] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="carousel" label="Carrusel" defaultData={{ height: "h-[300px]", images: [] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="progressbar" label="Barras Progreso" defaultData={{ items: [{ label: 'Habilidad', percentage: 90 }] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="form" label="Formulario" defaultData={{ title: "Contacto" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="testimonial" label="Testimonio" defaultData={{ author: "John Doe" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="social" label="Social Icons" defaultData={{ items: [{ network: 'linkedin', url: '#' }] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="map" label="Mapa" defaultData={{ height: "h-[400px]" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="tabs" label="Pestañas" defaultData={{ items: [{ label: "Tab 1", content: "..." }] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="toggle" label="Toggle (Colapso)" defaultData={{ items: [{ title: "Pregunta", content: "..." }] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="gallery" label="Galería" defaultData={{ images: [{ url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop", alt: "Img" }] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="counter" label="Contador" defaultData={{ items: [{ label: "Proyectos", value: 150, suffix: "+" }] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="counter" label="Contador" defaultData={{ items: [{ label: "Proyectos", value: 150, suffix: "+" }] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="lottie" label="Lottie" defaultData={{ jsonUrl: "https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json" }} onAdded={forcePreviewReload} />

                                        {/* PRO Widgets inside a Selected Container */}
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="loopgrid" label="Posts Dinámicos" defaultData={{ postType: "blog" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="portfolio" label="Portafolio" defaultData={{ columns: "grid-cols-1 md:grid-cols-3" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="pricing" label="Tablas de Precio" defaultData={{ title: "Pro", price: "$99" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="flipbox" label="Flip Boxes 3D" defaultData={{ frontTitle: "Gírame" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="hotspots" label="Hotspots (Puntos)" defaultData={{ spots: [{ id: 1, x: 50, y: 50, title: "Punto" }] }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="cta" label="Call to Action" defaultData={{ title: "Únete Ahora" }} onAdded={forcePreviewReload} />
                                        <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="navmenu" label="Nav Menu" defaultData={{ style: "horizontal" }} onAdded={forcePreviewReload} />
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </aside>

            {/* RIGHT PANEL: Live Preview Canvas */}
            <main className="flex-1 bg-zinc-100 p-4 lg:p-4 flex flex-col relative items-center">
                <div className="w-full max-w-6xl mb-4 flex items-center justify-between bg-white p-2 rounded-xl shadow-sm border border-zinc-200">
                    {/* Left: Navigator Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setSelectedBlockId(null); setViewMode('tree'); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-widest font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            <Layers size={14} /> Navigator
                        </button>
                    </div>

                    {/* Center: Responsive Toggles */}
                    <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setPreviewWidth('100%')}
                            className={`p-1.5 rounded-md transition-colors ${previewWidth === '100%' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Desktop"
                        ><Monitor size={16} /></button>
                        <button
                            onClick={() => setPreviewWidth('768px')}
                            className={`p-1.5 rounded-md transition-colors ${previewWidth === '768px' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Tablet"
                        ><Tablet size={16} /></button>
                        <button
                            onClick={() => setPreviewWidth('375px')}
                            className={`p-1.5 rounded-md transition-colors ${previewWidth === '375px' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Mobile"
                        ><Smartphone size={16} /></button>
                    </div>

                    {/* Right: Publish & Open */}
                    <div className="flex items-center gap-2">
                        <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-widest font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                            <ExternalLink size={14} /> Vista Previa
                        </a>
                        <button onClick={forcePreviewReload} className="flex items-center gap-2 px-4 py-1.5 text-[11px] uppercase tracking-widest font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-md">
                            <Save size={14} /> Actualizar
                        </button>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex-1"
                    style={{ width: previewWidth, maxWidth: '100%' }}
                >
                    <iframe
                        src="/?editor=true"
                        className="w-full h-full border-none"
                        title="Public Site Preview"
                        id="live-preview-iframe"
                    />
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
      `}} />
        </div>
    );
}

// Sub-Component: Add Widget Button
function WidgetAddBtn({ pageId, type, label, defaultData, onAdded, parentId }: { pageId: string, type: string, label: string, defaultData: any, onAdded: () => void, parentId: string | null }) {
    return (
        <button
            onClick={async () => {
                await addBlock(pageId, type, defaultData, parentId || undefined);
                onAdded();
            }}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all group shadow-sm"
        >
            <div className="bg-slate-50 p-1.5 rounded-md text-slate-400 group-hover:text-indigo-500 transition-colors"><Plus size={16} /></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{label}</span>
        </button>
    );
}

import HeroInspector from './inspectors/HeroInspector';
import RichTextInspector from './inspectors/RichTextInspector';
import TimelineInspector from './inspectors/TimelineInspector';
import BentoGridInspector from './inspectors/BentoGridInspector';
import GridInspector from './inspectors/GridInspector';
import AdvancedStyleInspector from './inspectors/AdvancedStyleInspector';
import VideoInspector from './inspectors/VideoInspector';
import ImageInspector from './inspectors/ImageInspector';
import AccordionInspector from './inspectors/AccordionInspector';
import CarouselInspector from './inspectors/CarouselInspector';
import HeadingInspector from './inspectors/HeadingInspector';
import ButtonInspector from './inspectors/ButtonInspector';
import DividerInspector from './inspectors/DividerInspector';
import SpacerInspector from './inspectors/SpacerInspector';
import FormInspector from './inspectors/FormInspector';
import TestimonialInspector from './inspectors/TestimonialInspector';
import SocialInspector from './inspectors/SocialInspector';
import MapInspector from './inspectors/MapInspector';
import ProgressBarInspector from './inspectors/ProgressBarInspector';
import TabsInspector from './inspectors/TabsInspector';
import ToggleInspector from './inspectors/ToggleInspector';
import GalleryInspector from './inspectors/GalleryInspector';
import CounterInspector from './inspectors/CounterInspector';
import LottieInspector from './inspectors/LottieInspector';
import PricingInspector from './inspectors/PricingInspector';
import FlipBoxInspector from './inspectors/FlipBoxInspector';
import CallToActionInspector from './inspectors/CallToActionInspector';
import NavMenuInspector from './inspectors/NavMenuInspector';
import PortfolioInspector from './inspectors/PortfolioInspector';
import HotspotsInspector from './inspectors/HotspotsInspector';
import LoopGridInspector from './inspectors/LoopGridInspector';

function InspectorForm({ block, onSaved }: { block: any, onSaved: () => void }) {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const isContainer = ['grid', 'hero', 'bento', 'timeline', 'accordion', 'carousel', 'gallery', 'tabs', 'toggle'].includes(block.type);
    const [activeTab, setActiveTab] = useState<'layout' | 'content' | 'styles'>(isContainer ? 'layout' : 'content');

    // Auto-switch tabs when selecting different types of blocks
    useEffect(() => {
        if (isContainer && activeTab === 'content') setActiveTab('layout');
        if (!isContainer && activeTab === 'layout') setActiveTab('content');
    }, [block.id, isContainer]);

    let parsedData = {};
    try {
        parsedData = JSON.parse(block.data);
    } catch (e) {
        return <div className="text-red-500 p-4">Error crítico: JSON corrupto en Base de Datos.</div>;
    }

    const handleSaveParsed = async (newParsedData: any) => {
        setIsSaving(true);
        try {
            await updateBlockData(block.id, JSON.stringify(newParsedData));
            onSaved();
        } catch (e) {
            setError('Error de Red guardando componente.');
        }
        setIsSaving(false);
    };

    return (
        <div className="flex flex-col gap-4">

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                {isContainer && (
                    <button
                        onClick={() => setActiveTab('layout')}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'layout' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Layout
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Contenido
                </button>
                <button
                    onClick={() => setActiveTab('styles')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'styles' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Estilos
                </button>
            </div>

            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                Cambios en tiempo real
            </p>

            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">{error}</div>}

            {isContainer && activeTab === 'content' && (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Box className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs text-slate-500 font-medium">Este bloque es un contenedor estructural.<br /><br />Usa la pestaña <b>Layout</b> para configurarlo, o inserta Elementos dentro de él desde la Paleta principal.</p>
                </div>
            )}

            {((isContainer && activeTab === 'layout') || (!isContainer && activeTab === 'content')) && (
                <>
                    {block.type === 'hero' && <HeroInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'richtext' && <RichTextInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'timeline' && <TimelineInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'bento' && <BentoGridInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'grid' && <GridInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'video' && <VideoInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'image' && <ImageInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'accordion' && <AccordionInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'carousel' && <CarouselInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}

                    {block.type === 'heading' && <HeadingInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'button' && <ButtonInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'divider' && <DividerInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'spacer' && <SpacerInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'form' && <FormInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'testimonial' && <TestimonialInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'social' && <SocialInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'map' && <MapInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'progressbar' && <ProgressBarInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'tabs' && <TabsInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'toggle' && <ToggleInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'gallery' && <GalleryInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'counter' && <CounterInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'lottie' && <LottieInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'pricing' && <PricingInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'flipbox' && <FlipBoxInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'cta' && <CallToActionInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'navmenu' && <NavMenuInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'portfolio' && <PortfolioInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'hotspots' && <HotspotsInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}
                    {block.type === 'loopgrid' && <LoopGridInspector initialData={parsedData} onSave={handleSaveParsed} isSaving={isSaving} />}

                    {!['hero', 'richtext', 'timeline', 'bento', 'grid', 'video', 'image', 'accordion', 'carousel', 'heading', 'button', 'divider', 'spacer', 'form', 'testimonial', 'social', 'map', 'progressbar', 'tabs', 'toggle', 'gallery', 'counter', 'lottie', 'pricing', 'flipbox', 'cta', 'navmenu', 'portfolio', 'hotspots', 'loopgrid'].includes(block.type) && (
                        <RawJsonFallback block={block} onSaved={onSaved} />
                    )}
                </>
            )}

            {activeTab === 'styles' && (
                <AdvancedStyleInspector block={block} onSaved={onSaved} />
            )}
        </div>
    );
}

function RawJsonFallback({ block, onSaved }: { block: any, onSaved: () => void }) {
    const [jsonString, setJsonString] = useState(block.data);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        try {
            JSON.parse(jsonString);
            setIsSaving(true);
            await updateBlockData(block.id, jsonString);
            onSaved();
            setIsSaving(false);
        } catch (e) {
            alert('JSON Inválido');
        }
    };

    return (
        <>
            <textarea
                value={jsonString}
                onChange={(e) => setJsonString(e.target.value)}
                className="w-full h-[300px] font-mono text-[11px] p-4 bg-slate-900 text-green-400 rounded-xl"
            />
            <button onClick={handleSave} disabled={isSaving} className="w-full bg-black text-white p-3 rounded-lg font-bold text-xs uppercase hover:bg-slate-800 mt-4 shadow-lg">
                {isSaving ? 'Guardando...' : 'Aplicar Raw JSON'}
            </button>
        </>
    );
}

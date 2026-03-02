'use client';

import { useState, useEffect, useCallback } from 'react';
import { updateBlockData, deleteBlock, addBlock, reorderBlocks } from './actions';
import {
    Trash2, Plus, Layers, Box, Settings2,
    Save, X, ChevronLeft, PanelLeft, Eye, ChevronUp, ChevronDown, Maximize2, Minimize2
} from 'lucide-react';
import GlobalSettingsForm from './GlobalSettingsForm';
import ClientInlineBlockRenderer from './ClientInlineBlockRenderer';

// ── Inspector Imports ──────────────────────────────────────────────
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

// ── Sub-Component: Add Widget Button ──────────────────────────────
function WidgetAddBtn({ pageId, type, label, defaultData, onAdded, parentId }: {
    pageId: string; type: string; label: string; defaultData: any;
    onAdded: () => void; parentId: string | null;
}) {
    return (
        <button
            onClick={async () => { await addBlock(pageId, type, defaultData, parentId || undefined); onAdded(); }}
            className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all group shadow-sm"
        >
            <div className="bg-slate-50 p-1 rounded-md text-slate-400 group-hover:text-indigo-500 transition-colors">
                <Plus size={14} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 text-center leading-tight">{label}</span>
        </button>
    );
}

// ── Sub-Component: Inspector Form (Tabs: Layout / Content / Style) ─
function InspectorForm({ block, onSaved }: { block: any; onSaved: () => void }) {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const isContainer = ['grid', 'hero', 'bento', 'timeline', 'accordion', 'carousel', 'gallery', 'tabs', 'toggle'].includes(block.type);
    const [activeTab, setActiveTab] = useState<'layout' | 'content' | 'styles'>(isContainer ? 'layout' : 'content');

    useEffect(() => {
        if (isContainer && activeTab === 'content') setActiveTab('layout');
        if (!isContainer && activeTab === 'layout') setActiveTab('content');
    }, [activeTab, block.id, isContainer]);

    let parsedData: any = {};
    try { parsedData = JSON.parse(block.data); } catch {
        return <div className="text-red-500 p-4 text-xs">Error: JSON corrupto en la BD.</div>;
    }

    const handleSaveParsed = async (newData: any) => {
        setIsSaving(true);
        try { await updateBlockData(block.id, JSON.stringify(newData)); onSaved(); }
        catch { setError('Error de red guardando.'); }
        setIsSaving(false);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                {isContainer && (
                    <button onClick={() => setActiveTab('layout')}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'layout' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
                        Layout
                    </button>
                )}
                <button onClick={() => setActiveTab('content')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
                    Contenido
                </button>
                <button onClick={() => setActiveTab('styles')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'styles' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
                    Estilos
                </button>
            </div>

            {error && <div className="p-2 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

            {isContainer && activeTab === 'content' && (
                <div className="p-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Box className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Contenedor estructural.<br />Usa <b>Layout</b> para configurarlo.</p>
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
                </>
            )}

            {activeTab === 'styles' && <AdvancedStyleInspector block={block} onSaved={onSaved} />}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────
export default function BuilderWorkspace({ page: initialPage, settings }: { page: any; settings: any }) {
    const [blocks, setBlocks] = useState<any[]>(initialPage?.blocks || []);
    const [page] = useState(initialPage);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'palette' | 'tree' | 'settings'>('palette');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const sidebarWidth = sidebarExpanded ? 'min(50vw, 760px)' : '340px';

    // Reload blocks from a real API route so canvas updates without full page refresh
    const reloadBlocks = useCallback(async () => {
        try {
            const res = await fetch(`/api/blocks?pageId=${page.id}`, { cache: 'no-store' });
            if (res.ok) { setBlocks(await res.json()); return; }
        } catch { /* fall through */ }
        window.location.reload();
    }, [page.id]);

    const forceFullReload = useCallback(() => { window.location.reload(); }, []);

    const handleBlockAdded = useCallback(async () => { await reloadBlocks(); }, [reloadBlocks]);

    const moveBlock = useCallback(async (blockId: string, direction: 'up' | 'down') => {
        const target = blocks.find((b: any) => b.id === blockId);
        if (!target) return;

        const siblings = blocks
            .filter((b: any) => (b.parentId ?? null) === (target.parentId ?? null))
            .sort((a: any, b: any) => a.order - b.order);

        const currentIndex = siblings.findIndex((b: any) => b.id === blockId);
        const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (currentIndex < 0 || nextIndex < 0 || nextIndex >= siblings.length) return;

        const reordered = [...siblings];
        [reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];
        await reorderBlocks(page.id, reordered.map((b: any) => b.id));
        await reloadBlocks();
        setSelectedBlockId(blockId);
    }, [blocks, page.id, reloadBlocks]);

    // Scroll selected block into view in the canvas
    useEffect(() => {
        if (!selectedBlockId) return;
        const el = document.querySelector(`[data-block-id="${selectedBlockId}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [selectedBlockId]);

    // Derived
    const rootBlocks = blocks.filter((b: any) => !b.parentId).sort((a: any, b: any) => a.order - b.order);
    const selectedBlock = blocks.find((b: any) => b.id === selectedBlockId) ?? null;

    // Layer Tree renderer
    const renderBlockTree = (blockLayer: any[], depth = 0): React.ReactNode => {
        return blockLayer.map((block: any) => {
            const children = blocks.filter((b: any) => b.parentId === block.id).sort((a: any, b: any) => a.order - b.order);
            const isGrid = block.type === 'grid';
            const currentIndex = blockLayer.findIndex((b: any) => b.id === block.id);
            const isFirst = currentIndex === 0;
            const isLast = currentIndex === blockLayer.length - 1;
            return (
                <div key={block.id}>
                    <div
                        className={`w-full flex items-center gap-1 p-1 rounded-lg transition-colors ${selectedBlockId === block.id ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-slate-100'}`}
                        style={{ paddingLeft: `${8 + depth * 12}px` }}
                    >
                        <button
                            onClick={() => setSelectedBlockId(block.id)}
                            className="flex-1 min-w-0 flex items-center gap-2 p-1.5 rounded-md text-left"
                        >
                            {isGrid && <Layers size={14} className="text-indigo-500 shrink-0" />}
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">{block.type}</div>
                                <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                                    {isGrid ? 'Contenedor de Columnas' : block.data.substring(0, 40) + '...'}
                                </div>
                            </div>
                        </button>
                        <div className="flex items-center gap-0.5">
                            <button
                                onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                                disabled={isFirst}
                                title="Subir"
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronUp size={13} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                                disabled={isLast}
                                title="Bajar"
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronDown size={13} />
                            </button>
                        </div>
                    </div>
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
        <div className="relative w-full min-h-screen">

            {/* ── FLOATING SIDEBAR PANEL ────────────────────────────────── */}
            <aside
                className={`fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? '' : 'overflow-hidden'}`}
                style={{ width: sidebarOpen ? sidebarWidth : '0px', boxShadow: '4px 0 32px rgba(0,0,0,0.18)' }}
            >
                <div className="h-full flex flex-col bg-white border-r border-slate-200" style={{ width: sidebarWidth }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-indigo-700 text-white shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Supreme Builder</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarExpanded(prev => !prev)}
                                className="text-indigo-200 hover:text-white"
                                title={sidebarExpanded ? 'Contraer panel' : 'Expandir panel (50%)'}
                            >
                                {sidebarExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                            </button>
                            <button onClick={() => setSidebarOpen(false)} className="text-indigo-200 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Mode Tabs (when no block selected) */}
                    {!selectedBlock && (
                        <div className="flex bg-slate-100 mx-3 mt-3 rounded-xl p-1 shrink-0">
                            <button onClick={() => setViewMode('palette')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 transition-all ${viewMode === 'palette' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
                                <Plus size={12} /> Insertar
                            </button>
                            <button onClick={() => setViewMode('tree')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 transition-all ${viewMode === 'tree' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
                                <Layers size={12} /> Capas
                            </button>
                            <button onClick={() => setViewMode('settings')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 transition-all ${viewMode === 'settings' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
                                <Settings2 size={12} /> Diseño
                            </button>
                        </div>
                    )}

                    {/* Scrollable Panel Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">

                        {viewMode === 'settings' && !selectedBlock && (
                            <GlobalSettingsForm settings={settings} onSaved={forceFullReload} />
                        )}

                        {viewMode === 'palette' && !selectedBlock && (
                            <div className="p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-left-4">
                                <section>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Estructura</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="hero" label="Portada (Hero)" defaultData={{ name: 'Nuevo Bloque', role: 'Tu Cargo', links: [] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="grid" label="Cuadrícula" defaultData={{ columns: 2 }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="bento" label="Bento Grid" defaultData={{ title: 'Portafolio', bentoType: 'general', items: [] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="timeline" label="Línea de Vida" defaultData={{ title: 'Experiencia', items: [] }} onAdded={handleBlockAdded} />
                                    </div>
                                </section>
                                <section>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Básicos</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="heading" label="Encabezado" defaultData={{ text: 'Nuevo Encabezado', tag: 'h2' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="richtext" label="Texto" defaultData={{ title: 'Sección', content: '<p>Escribe algo...</p>' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="button" label="Botón" defaultData={{ text: 'Haz clic', link: '#', style: 'primary' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="image" label="Imagen" defaultData={{ url: '', alt: '' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="video" label="Video" defaultData={{ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="divider" label="Divider" defaultData={{ style: 'solid' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="spacer" label="Espaciador" defaultData={{ height: 'h-12' }} onAdded={handleBlockAdded} />
                                    </div>
                                </section>
                                <section>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Avanzados</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="progressbar" label="Progress Bars" defaultData={{ items: [{ label: 'Skill', percentage: 90 }] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="form" label="Formulario" defaultData={{ title: 'Contacto' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="testimonial" label="Testimonio" defaultData={{ author: 'John' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="social" label="Redes Sociales" defaultData={{ items: [{ network: 'linkedin', url: '#' }] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="map" label="Google Maps" defaultData={{ height: 'h-[400px]' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="tabs" label="Pestañas" defaultData={{ items: [{ label: 'Tab', content: '...' }] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="toggle" label="Toggle" defaultData={{ items: [{ title: 'P', content: 'R' }] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="gallery" label="Galería" defaultData={{ images: [{ url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600', alt: '' }] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="counter" label="Contador" defaultData={{ items: [{ label: 'Proyectos', value: 150, suffix: '+' }] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="lottie" label="Lottie" defaultData={{ jsonUrl: 'https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="accordion" label="Acordeón" defaultData={{ title: 'FAQ', items: [] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="carousel" label="Carrusel" defaultData={{ height: 'h-[400px]', images: [] }} onAdded={handleBlockAdded} />
                                    </div>
                                </section>
                                <section className="mb-8">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 ml-1">Profesionales (PRO)</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="loopgrid" label="Posts Dinámicos" defaultData={{ postType: 'blog' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="portfolio" label="Portafolio" defaultData={{ columns: 'grid-cols-1 md:grid-cols-3' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="pricing" label="Precios" defaultData={{ title: 'Pro', price: '$99' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="flipbox" label="Flip Boxes" defaultData={{ frontTitle: 'Gírame' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="hotspots" label="Hotspots" defaultData={{ spots: [{ id: 1, x: 50, y: 50, title: 'Pin' }] }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="cta" label="Call to Action" defaultData={{ title: 'Únete' }} onAdded={handleBlockAdded} />
                                        <WidgetAddBtn pageId={page.id} parentId={null} type="navmenu" label="Nav Menu" defaultData={{ style: 'horizontal' }} onAdded={handleBlockAdded} />
                                    </div>
                                </section>
                            </div>
                        )}

                        {viewMode === 'tree' && !selectedBlock && (
                            <div className="p-4 flex flex-col gap-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Capas y Nodos</h3>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="hero" label="Hero" defaultData={{ greeting: 'Hola, soy', name: 'Nombre Apellido', role: 'Tu rol profesional', links: [] }} onAdded={handleBlockAdded} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="richtext" label="Texto" defaultData={{ title: 'Sección', content: '<p>Nuevo contenido...</p>' }} onAdded={handleBlockAdded} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="timeline" label="Timeline" defaultData={{ title: 'Experiencia', items: [] }} onAdded={handleBlockAdded} />
                                    <WidgetAddBtn pageId={page.id} parentId={null} type="grid" label="Grid" defaultData={{ columns: 2 }} onAdded={handleBlockAdded} />
                                </div>
                                {blocks.length === 0 && <p className="text-xs text-slate-400 italic text-center py-8">La página está vacía.</p>}
                                <div className="space-y-1">{renderBlockTree(rootBlocks)}</div>
                            </div>
                        )}

                        {/* Inspector shown when a block is selected */}
                        {selectedBlock && (
                            <div className="p-4 animate-in fade-in slide-in-from-right-4 text-slate-900 [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400 [&_textarea]:text-slate-900 [&_textarea]:placeholder:text-slate-400 [&_select]:text-slate-900">
                                <button onClick={() => setSelectedBlockId(null)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-4 hover:text-indigo-800 flex items-center gap-1">
                                    <ChevronLeft size={12} /> Volver
                                </button>

                                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">✏️ {selectedBlock.type}</h3>
                                    <button
                                        onClick={async () => {
                                            if (confirm('¿Eliminar este bloque?')) {
                                                await deleteBlock(selectedBlock.id);
                                                setSelectedBlockId(null);
                                                await reloadBlocks();
                                            }
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-md"
                                    ><Trash2 size={16} /></button>
                                </div>

                                <InspectorForm block={selectedBlock} onSaved={reloadBlocks} />

                                {/* Insert inside Grid */}
                                {selectedBlock.type === 'grid' && (
                                    <div className="mt-6 pt-4 border-t border-indigo-100">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-3">Insertar dentro del Grid</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="heading" label="Encabezado" defaultData={{ text: 'Título', tag: 'h3' }} onAdded={handleBlockAdded} />
                                            <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="richtext" label="Texto" defaultData={{ title: 'Sección', content: '<p>...</p>' }} onAdded={handleBlockAdded} />
                                            <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="button" label="Botón" defaultData={{ text: 'Ir', style: 'primary' }} onAdded={handleBlockAdded} />
                                            <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="image" label="Imagen" defaultData={{ url: '', alt: '' }} onAdded={handleBlockAdded} />
                                            <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="gallery" label="Galería" defaultData={{ images: [] }} onAdded={handleBlockAdded} />
                                            <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="counter" label="Contador" defaultData={{ items: [] }} onAdded={handleBlockAdded} />
                                            <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="pricing" label="Precios" defaultData={{ title: 'Pro', price: '$99' }} onAdded={handleBlockAdded} />
                                            <WidgetAddBtn pageId={page.id} parentId={selectedBlock.id} type="cta" label="CTA" defaultData={{ title: 'Únete' }} onAdded={handleBlockAdded} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="shrink-0 p-3 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
                        <button onClick={() => setPreviewOpen(true)}
                            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors">
                            <Eye size={14} /> Vista Previa
                        </button>
                        <button onClick={forceFullReload}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors shadow-md">
                            <Save size={14} /> Actualizar y Publicar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Toggle button (when sidebar is closed) */}
            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="fixed top-4 left-4 z-50 w-10 h-10 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 transition-colors"
                    title="Abrir Panel"
                >
                    <PanelLeft size={18} />
                </button>
            )}

            {/* ── THE PAGE IS THE CANVAS ────────────────────────────────── */}
            <div
                className="transition-all duration-300 ease-in-out"
                style={{ marginLeft: sidebarOpen ? sidebarWidth : '0' }}
                onClick={(e) => {
                    if ((e.target as HTMLElement).closest('[data-block-id]') === null) {
                        setSelectedBlockId(null);
                    }
                }}
            >
                <ClientInlineBlockRenderer
                    blocks={blocks}
                    selectedBlockId={selectedBlockId}
                    onSelect={setSelectedBlockId}
                />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
            `}} />
            {/* PREVIEW MODAL */}
            {previewOpen && (
                <div
                    className="fixed inset-0 z-[100] flex flex-col bg-black/75 backdrop-blur-sm animate-in fade-in"
                    onClick={(e) => { if (e.target === e.currentTarget) setPreviewOpen(false); }}
                >
                    <div className="flex items-center justify-between px-6 py-3 bg-[#1a1a1e] border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white text-[11px] font-bold uppercase tracking-widest">Vista Previa</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="/" target="_blank"
                                className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                                Abrir en Pestaña
                            </a>
                            <button onClick={() => setPreviewOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative bg-zinc-900 p-4">
                        <iframe
                            src="/"
                            className="w-full h-full rounded-xl border-none shadow-2xl"
                            title="Vista Previa del Sitio"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

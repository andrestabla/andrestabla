'use client';

import { useState } from 'react';
import { updateBlockData, deleteBlock, addBlock } from './actions';
import { Trash2, Save, Plus, GripVertical, Settings } from 'lucide-react';

export default function BuilderWorkspace({ page }: { page: any }) {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    // The actual blocks from the database
    const blocks = page.blocks || [];

    // Find the selected block object
    const selectedBlock = blocks.find((b: any) => b.id === selectedBlockId);

    // Helper macro to reload the iframe on the right side
    const forcePreviewReload = () => {
        const iframe = document.getElementById('live-preview-iframe') as HTMLIFrameElement;
        if (iframe) iframe.src = iframe.src;
    };

    return (
        <div className="flex h-full w-full">
            {/* LEFT PANEL: The Inspector & Block List */}
            <aside className="w-[400px] h-full bg-white border-r border-[#d2d2d7] flex flex-col shadow-2xl relative z-10 shrink-0">

                {/* Header */}
                <div className="p-4 border-b border-[#e5e7eb] flex justify-between items-center bg-zinc-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-md"><Settings size={16} /></div>
                        <div>
                            <h2 className="font-bold text-xs tracking-tight text-slate-900 leading-none">Constructor Visual</h2>
                            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mt-1 block">Página: {page.title}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">

                    {/* If NO Block is selected, show the Navigator (List of Blocks) */}
                    {!selectedBlock && (
                        <div className="p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-left-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Estructura de la Página</h3>

                            {blocks.length === 0 && <p className="text-xs text-slate-400 italic text-center py-8">La página está vacía.</p>}

                            {blocks.map((block: any) => (
                                <button
                                    key={block.id}
                                    onClick={() => setSelectedBlockId(block.id)}
                                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group"
                                >
                                    <div className="text-slate-300 group-hover:text-blue-500 cursor-grab"><GripVertical size={16} /></div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">{block.type}</div>
                                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                            {block.data.substring(0, 40)}...
                                        </div>
                                    </div>
                                </button>
                            ))}

                            <div className="mt-8">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Añadir Widget</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <WidgetAddBtn pageId={page.id} type="hero" label="Portada (Hero)" defaultData={{ name: "Nuevo Bloque", role: "Tu Cargo", links: [] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} type="richtext" label="Texto (Prose)" defaultData={{ title: "Título Seccion", content: "<p>Escribe algo increíble...</p>" }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} type="timeline" label="Línea de Vida" defaultData={{ title: "Experiencia", items: [] }} onAdded={forcePreviewReload} />
                                    <WidgetAddBtn pageId={page.id} type="bento" label="Bento Grid" defaultData={{ title: "Portafolio", bentoType: "general", items: [] }} onAdded={forcePreviewReload} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* If a Block IS selected, show its specific Inspector Form */}
                    {selectedBlock && (
                        <div className="p-4 animate-in fade-in slide-in-from-right-4">
                            <button onClick={() => setSelectedBlockId(null)} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-4 hover:text-blue-800 flex items-center gap-1">
                                ← Volver a la lista
                            </button>

                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">Editar: {selectedBlock.type}</h3>
                                <button
                                    onClick={async () => {
                                        if (confirm('¿Eliminar este bloque?')) {
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
                        </div>
                    )}
                </div>
            </aside>

            {/* RIGHT PANEL: Live Preview Canvas */}
            <main className="flex-1 bg-zinc-100 p-4 lg:p-4 flex flex-col relative">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-zinc-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Canvas
                    </div>
                    <a href="/" target="_blank" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Abrir en Pestaña Nueva ↗</a>
                </div>

                <div className="flex-1 bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden relative">
                    <iframe
                        src="/"
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
function WidgetAddBtn({ pageId, type, label, defaultData, onAdded }: { pageId: string, type: string, label: string, defaultData: any, onAdded: () => void }) {
    return (
        <button
            onClick={async () => {
                await addBlock(pageId, type, defaultData);
                onAdded();
            }}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-black hover:bg-slate-100 transition-all group"
        >
            <div className="bg-white p-1.5 rounded-md shadow-sm text-slate-400 group-hover:text-black transition-colors"><Plus size={16} /></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{label}</span>
        </button>
    );
}

// Sub-Component: The Dynamic Form Editor (Simplistic raw JSON editor mapping for Phase B Core)
function InspectorForm({ block, onSaved }: { block: any, onSaved: () => void }) {

    // For the very first iteration of the builder, we manipulate the raw structured JSON.
    // In Phase C, this will be expanded into specific UI inputs (textboxes) per block type.
    const [jsonString, setJsonString] = useState(block.data);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        try {
            // Validate JSON
            JSON.parse(jsonString);
            setError('');
            setIsSaving(true);
            await updateBlockData(block.id, jsonString);
            onSaved();
            setIsSaving(false);
        } catch (e) {
            setError('Error de Sintaxis JSON. Revisa las llaves o comillas.');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                Edita la estructura de datos del componente abajo. Los cambios se verán en el Canvas al guardar.
            </p>

            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">{error}</div>}

            <textarea
                value={jsonString}
                onChange={(e) => setJsonString(e.target.value)}
                className="w-full h-[400px] font-mono text-[11px] p-4 bg-slate-900 text-green-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner"
                spellCheck="false"
            />

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-black text-white p-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 mt-4"
            >
                <Save size={14} /> {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
        </div>
    );
}

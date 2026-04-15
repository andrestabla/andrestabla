'use client';

import { useState } from 'react';
import { Bot, Save } from 'lucide-react';
import { updateAssistantSettings } from './actions';
import {
    DEFAULT_ASSISTANT_BASE_PROMPT,
    MAX_ASSISTANT_DOCUMENT_CHARS,
    MAX_ASSISTANT_PROMPT_CHARS,
    parseAssistantConfig,
} from '@/lib/assistantConfig';

export default function AssistantSettingsForm({
    settings,
}: {
    settings: any;
}) {
    const assistantConfig = parseAssistantConfig(settings?.globalStyles);
    const [assistantBasePrompt, setAssistantBasePrompt] = useState(assistantConfig.assistantBasePrompt);
    const [assistantContextDocument, setAssistantContextDocument] = useState(assistantConfig.assistantContextDocument);
    const [isSaving, setIsSaving] = useState(false);
    const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSaving(true);
        setSaveState('idle');

        try {
            await updateAssistantSettings(
                assistantBasePrompt.trim() || DEFAULT_ASSISTANT_BASE_PROMPT,
                assistantContextDocument.trim()
            );
            setSaveState('saved');
        } catch {
            setSaveState('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
                <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand)]/15 text-[var(--brand)]">
                        <Bot size={18} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--brand)]">Asistente IA</p>
                        <h1 className="text-2xl font-bold text-white">Prompt y documento de contexto</h1>
                        <p className="max-w-2xl text-sm text-zinc-400">
                            Configura aquí el comportamiento base del asistente y el documento de análisis que utilizará
                            como contexto adicional. El cambio impacta en tiempo real las respuestas nuevas del chatbot.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">Prompt Base</p>
                        <span className="text-[11px] text-zinc-500">
                            {assistantBasePrompt.length}/{MAX_ASSISTANT_PROMPT_CHARS}
                        </span>
                    </div>
                    <textarea
                        value={assistantBasePrompt}
                        onChange={(e) => setAssistantBasePrompt(e.target.value.slice(0, MAX_ASSISTANT_PROMPT_CHARS))}
                        rows={14}
                        className="min-h-[320px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-relaxed text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-[var(--brand)]"
                        placeholder="Describe el rol, tono, objetivo y alcance del asistente."
                    />
                    <p className="mt-3 text-xs text-zinc-500">
                        Las reglas críticas del sistema siguen activas: idioma, no inventar datos y contactos oficiales.
                    </p>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">Documento de Contexto</p>
                        <span className="text-[11px] text-zinc-500">
                            {assistantContextDocument.length}/{MAX_ASSISTANT_DOCUMENT_CHARS}
                        </span>
                    </div>
                    <textarea
                        value={assistantContextDocument}
                        onChange={(e) => setAssistantContextDocument(e.target.value.slice(0, MAX_ASSISTANT_DOCUMENT_CHARS))}
                        rows={22}
                        className="min-h-[520px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-[var(--brand)]"
                        placeholder="Pega aquí el documento de análisis, FAQ, servicios, objeciones, casos, políticas o contexto comercial."
                    />
                    <p className="mt-3 text-xs text-zinc-500">
                        Este documento se suma a la base curricular fija del asistente y al resumen detectado automáticamente en el sitio.
                    </p>
                </div>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-white">Guardar configuración del asistente</p>
                        <p className="mt-1 text-xs text-zinc-500">
                            Al guardar, las siguientes conversaciones del chatbot usarán este prompt y este documento.
                        </p>
                        {saveState === 'saved' && (
                            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                                Guardado correctamente
                            </p>
                        )}
                        {saveState === 'error' && (
                            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-red-400">
                                No se pudo guardar. Intenta de nuevo.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={15} />
                        {isSaving ? 'Guardando...' : 'Guardar Asistente IA'}
                    </button>
                </div>
            </section>
        </form>
    );
}

'use client';

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { CONSENT_POLICY_VERSION, readStoredConsent } from '@/lib/consent';

type ChatMessage = {
    role: 'assistant' | 'user';
    content: string;
    actions?: ChatAction[];
};

type ChatAction = {
    label: string;
    url: string;
};

const INITIAL_MESSAGE: ChatMessage = {
    role: 'assistant',
    content: 'Hola, soy el asistente de Andrés Tabla. Puedo contarte sobre su perfil, experiencia, formación y proyectos. ¿Qué te gustaría conocer?',
};

const QUICK_PROMPTS = [
    '¿Quién es Andrés Tabla?',
    '¿Cuál es su experiencia?',
    '¿Cómo puedo contactarlo?',
];

export default function AndresAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isLoading, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

    const sendMessage = async (text: string) => {
        const userText = text.trim();
        if (!userText || isLoading) return;

        const nextMessages = [...messages, { role: 'user', content: userText } as ChatMessage];
        setMessages(nextMessages);
        setInput('');
        if (inputRef.current) {
            inputRef.current.style.height = '44px';
        }
        setError('');
        setIsLoading(true);

        try {
            const consent = readStoredConsent();
            const consentState = consent?.decision === 'accepted' ? 'accepted' : 'declined';
            const consentVersion = consent?.version || CONSENT_POLICY_VERSION;
            const res = await fetch('/api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-consent-state': consentState,
                    'x-consent-version': consentVersion,
                },
                body: JSON.stringify({ messages: nextMessages, path: window.location.pathname }),
            });

            const payload = await res.json();
            if (!res.ok) {
                throw new Error(payload?.error || 'No fue posible responder ahora.');
            }

            const actions = Array.isArray(payload?.actions)
                ? payload.actions
                    .filter(
                        (action: any) =>
                            action &&
                            typeof action.label === 'string' &&
                            typeof action.url === 'string'
                    )
                    .slice(0, 3)
                : undefined;

            setMessages((prev) => [...prev, { role: 'assistant', content: payload.message, actions }]);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error de conexión.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await sendMessage(input);
    };

    const handleQuickPrompt = async (prompt: string) => {
        await sendMessage(prompt);
    };

    const handleInputKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!canSend) return;
            await sendMessage(input);
        }
    };

    const handleInputChange = (value: string) => {
        setInput(value);
        if (!inputRef.current) return;
        inputRef.current.style.height = '44px';
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 140)}px`;
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="safe-fab fixed right-4 z-[80] rounded-full bg-[var(--brand)] text-white shadow-xl hover:brightness-105 transition-all px-4 py-3 flex items-center gap-2"
                    aria-label="Abrir asistente de Andrés Tabla"
                >
                    <MessageCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Asistente</span>
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-x-2 top-2 bottom-2 z-[80] md:inset-auto md:bottom-4 md:right-4 md:w-[min(92vw,420px)] md:h-[min(72vh,620px)] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="safe-top px-3 py-2.5 md:px-4 md:py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)]">
                                <Bot size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white leading-tight">Asistente de Andrés</p>
                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Powered by OpenAI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                            aria-label="Cerrar asistente"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    <div ref={scrollRef} className="scrollbar-invisible flex-1 overflow-y-auto overscroll-contain p-3 md:p-4 space-y-3 bg-zinc-950">
                        {messages.map((message, idx) => (
                            <div
                                key={`${message.role}-${idx}`}
                                className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${message.role === 'user'
                                    ? 'ml-auto bg-[var(--brand)] text-white'
                                    : 'mr-auto bg-zinc-900 text-zinc-200 border border-zinc-800'
                                    }`}
                            >
                                <p className="whitespace-pre-line">{message.content}</p>
                                {message.role === 'assistant' && message.actions && message.actions.length > 0 && (
                                    <div className="mt-3 grid gap-2">
                                        {message.actions.map((action, actionIdx) => (
                                            <a
                                                key={`${action.label}-${actionIdx}`}
                                                href={action.url}
                                                target={action.url.startsWith('mailto:') ? undefined : '_blank'}
                                                rel={action.url.startsWith('mailto:') ? undefined : 'noreferrer noopener'}
                                                className="group flex w-full items-center justify-between rounded-xl border border-[var(--brand)]/45 bg-[var(--brand)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[var(--brand)]/25 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-[var(--brand)]/35"
                                            >
                                                <span>{action.label}</span>
                                                <span className="text-base leading-none transition-transform group-hover:translate-x-0.5">→</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {messages.length <= 2 && !isLoading && (
                            <div className="grid grid-cols-1 gap-2">
                                {QUICK_PROMPTS.map((prompt) => (
                                    <button
                                        key={prompt}
                                        type="button"
                                        onClick={() => handleQuickPrompt(prompt)}
                                        className="text-left rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 hover:border-[var(--brand)] hover:text-white transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="mr-auto bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-2xl px-3 py-2 text-sm">
                                Escribiendo...
                            </div>
                        )}

                        {error && (
                            <div className="mr-auto bg-red-950/40 border border-red-900 text-red-200 rounded-2xl px-3 py-2 text-xs">
                                {error}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="safe-bottom p-2.5 md:p-3 border-t border-zinc-800 bg-zinc-900/80 flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            placeholder="Escribe tu pregunta..."
                            rows={1}
                            className="flex-1 resize-none min-h-[44px] max-h-[140px] rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 p-2.5 text-base md:text-sm outline-none focus:border-[var(--brand)]"
                        />
                        <button
                            type="submit"
                            disabled={!canSend}
                            className="shrink-0 h-[44px] w-[44px] rounded-xl bg-[var(--brand)] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition-all"
                            aria-label="Enviar mensaje"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

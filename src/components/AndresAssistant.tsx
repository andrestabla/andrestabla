'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';

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

export default function AndresAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isLoading, isOpen]);

    const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const userText = input.trim();
        if (!userText || isLoading) return;

        const nextMessages = [...messages, { role: 'user', content: userText } as ChatMessage];
        setMessages(nextMessages);
        setInput('');
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: nextMessages }),
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

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-5 right-5 z-[80] rounded-full bg-[var(--brand)] text-white shadow-xl hover:brightness-105 transition-all px-4 py-3 flex items-center gap-2"
                    aria-label="Abrir asistente de Andrés Tabla"
                >
                    <MessageCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Asistente</span>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-4 right-4 z-[80] w-[min(92vw,420px)] h-[min(72vh,620px)] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
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

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-950">
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

                    <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800 bg-zinc-900/80 flex items-end gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                            rows={2}
                            className="flex-1 resize-none rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 p-2.5 text-sm outline-none focus:border-[var(--brand)]"
                        />
                        <button
                            type="submit"
                            disabled={!canSend}
                            className="shrink-0 h-[42px] w-[42px] rounded-xl bg-[var(--brand)] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition-all"
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

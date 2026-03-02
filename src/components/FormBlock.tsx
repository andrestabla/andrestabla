'use client';

import React, { useState } from 'react';
import { safeHtml } from '@/lib/html';

export default function FormBlock({ data }: { data: any }) {
    const title = data.title || 'Contáctanos';
    const subtitle = data.subtitle || 'Déjanos un mensaje y te responderemos pronto.';
    const buttonText = data.buttonText || 'Enviar Mensaje';
    const emailTo = data.emailTo || 'andrestabla@algoritmot.com';

    const [status, setStatus] = useState<'' | 'sending' | 'success' | 'error'>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Dummy timeout for simulation
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-heading text-white font-bold mb-2" dangerouslySetInnerHTML={safeHtml(title)} />
            <p className="text-zinc-400 text-sm mb-6" dangerouslySetInnerHTML={safeHtml(subtitle)} />

            {status === 'success' ? (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-center font-medium">
                    ¡Mensaje enviado correctamente! Nos pondremos en contacto.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Nombre Completo</label>
                            <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Correo Electrónico</label>
                            <input required type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Asunto</label>
                        <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Mensaje</label>
                        <textarea required rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"></textarea>
                    </div>
                    <button disabled={status === 'sending'} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-widest uppercase text-xs py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                        <span dangerouslySetInnerHTML={safeHtml(status === 'sending' ? 'Enviando...' : buttonText)} />
                    </button>
                    <p className="text-[9px] text-zinc-600 text-center uppercase tracking-widest mt-4">Formulario simula envío a: {emailTo}</p>
                </form>
            )}
        </div>
    );
}

'use client';

import { useMemo } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { SITE_URL, stripHtml } from '@/lib/seo';

type ResumeActionsProps = {
    fullName: string;
    phone?: string;
    email?: string;
};

export default function ResumeActions({
    fullName,
    phone,
    email,
}: ResumeActionsProps) {
    const cleanName = stripHtml(fullName || '') || 'Andres Tabla Rico';
    const cleanedPhone = useMemo(
        () => String(phone || '').replace(/[^\d]/g, ''),
        [phone]
    );
    const whatsappUrl = useMemo(
        () =>
            cleanedPhone
                ? `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
                    `Hola ${cleanName}, vi tu sitio web ${SITE_URL} y quisiera ponerme en contacto contigo.`
                )}`
                : '',
        [cleanName, cleanedPhone]
    );
    const emailUrl = useMemo(
        () =>
            email
                ? `mailto:${email}?subject=${encodeURIComponent(`Contacto desde ${SITE_URL}`)}&body=${encodeURIComponent(
                    `Hola ${cleanName}, vi tu sitio web y quisiera ponerme en contacto contigo.`
                )}`
                : '',
        [cleanName, email]
    );

    return (
        <div className="mt-10 print:hidden" data-pdf-ignore="true">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                {whatsappUrl ? (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 rounded-full border border-zinc-800 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-zinc-900"
                    >
                        <MessageCircle size={16} />
                        <span>WhatsApp</span>
                    </a>
                ) : null}

                {emailUrl ? (
                    <a
                        href={emailUrl}
                        className="inline-flex items-center justify-center gap-3 rounded-full border border-zinc-800 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-zinc-900"
                    >
                        <Mail size={16} />
                        <span>Correo</span>
                    </a>
                ) : null}
            </div>

            <p className="mt-3 text-xs text-slate-400" aria-live="polite">
                Contacta directamente a Andrés Tabla por WhatsApp o correo electrónico.
            </p>
        </div>
    );
}

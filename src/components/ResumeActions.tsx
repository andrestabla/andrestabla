'use client';

import { useMemo } from 'react';
import { Download, Mail, MessageCircle } from 'lucide-react';
import { SITE_URL, stripHtml } from '@/lib/seo';

type ResumeActionsProps = {
    fullName: string;
    role?: string;
    resumeUrl?: string;
    shareText?: string;
};

export default function ResumeActions({
    fullName,
    role,
    resumeUrl,
    shareText,
}: ResumeActionsProps) {
    const cleanName = stripHtml(fullName || '') || 'Andres Tabla Rico';
    const cleanRole = stripHtml(role || '');
    const cleanShareText = useMemo(
        () => stripHtml(shareText || '') || `${cleanName}${cleanRole ? ` · ${cleanRole}` : ''}`,
        [cleanName, cleanRole, shareText]
    );
    const siteUrl = SITE_URL;
    const downloadUrl = useMemo(
        () => String(resumeUrl || '').trim() || '/api/resume-pdf',
        [resumeUrl]
    );
    const whatsappUrl = useMemo(
        () =>
            `https://wa.me/?text=${encodeURIComponent(
                `Te comparto la hoja de vida de ${cleanName}.\n${cleanShareText}\n${siteUrl}`
            )}`,
        [cleanName, cleanShareText, siteUrl]
    );
    const emailUrl = useMemo(
        () =>
            `mailto:?subject=${encodeURIComponent(`Hoja de vida de ${cleanName}`)}&body=${encodeURIComponent(
                `Hola,\n\nTe comparto la hoja de vida de ${cleanName}.\n${cleanShareText}\n${siteUrl}`
            )}`,
        [cleanName, cleanShareText, siteUrl]
    );

    return (
        <div className="mt-10 print:hidden" data-pdf-ignore="true">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-zinc-800 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-zinc-200"
                    title="Descargar hoja de vida en PDF"
                >
                    <Download size={16} />
                    <span>Descargar HV (PDF)</span>
                </a>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-zinc-800 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-zinc-900"
                >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                </a>

                <a
                    href={emailUrl}
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-zinc-800 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-zinc-900"
                >
                    <Mail size={16} />
                    <span>Correo</span>
                </a>
            </div>

            <p className="mt-3 text-xs text-slate-400" aria-live="polite">
                Descarga la HV en PDF o compártela por WhatsApp o correo electrónico.
            </p>
        </div>
    );
}

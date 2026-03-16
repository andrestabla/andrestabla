'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Download, Share2 } from 'lucide-react';
import type { Html2PdfOptions } from 'html2pdf.js';

type ResumeActionsProps = {
    fullName: string;
    role?: string;
    resumeUrl?: string;
    shareText?: string;
};

type FeedbackState = 'idle' | 'downloaded' | 'shared' | 'copied' | 'error';

function stripHtml(value?: string) {
    return String(value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export default function ResumeActions({
    fullName,
    role,
    resumeUrl,
    shareText,
}: ResumeActionsProps) {
    const [feedback, setFeedback] = useState<FeedbackState>('idle');
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const cleanName = stripHtml(fullName) || 'Andres Tabla Rico';
    const cleanRole = stripHtml(role);
    const cleanShareText = useMemo(
        () => stripHtml(shareText) || `${cleanName}${cleanRole ? ` · ${cleanRole}` : ''}`,
        [cleanName, cleanRole, shareText]
    );
    const fileName = useMemo(
        () =>
            `${cleanName || 'hoja-de-vida'}`
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .toLowerCase() || 'hoja-de-vida',
        [cleanName]
    );

    useEffect(() => {
        if (feedback === 'idle') return;
        const timeoutId = window.setTimeout(() => setFeedback('idle'), 2800);
        return () => window.clearTimeout(timeoutId);
    }, [feedback]);

    const handleDownload = async () => {
        if (resumeUrl) {
            const link = document.createElement('a');
            link.href = resumeUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setFeedback('downloaded');
            return;
        }

        const source = document.querySelector<HTMLElement>('[data-pdf-root="resume"]');
        if (!source || isGeneratingPdf) {
            setFeedback('error');
            return;
        }

        const exportHost = document.createElement('div');
        const clone = source.cloneNode(true) as HTMLElement;
        const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#111827';

        exportHost.className = 'pdf-export-host';
        clone.classList.add('pdf-export-mode');
        clone.querySelectorAll('[data-pdf-ignore="true"]').forEach((element) => element.remove());
        clone.style.setProperty('--brand', brand);
        clone.style.setProperty('--secondary', '#ffffff');
        clone.style.setProperty('--btn-bg', '#ffffff');
        clone.style.setProperty('--btn-hover', '#f4f4f5');
        clone.style.setProperty('--text', '#111827');
        clone.style.setProperty('--heading', '#111827');
        clone.style.backgroundColor = '#ffffff';
        clone.style.color = '#111827';
        clone.style.paddingTop = '0';
        clone.style.paddingBottom = '0';

        exportHost.appendChild(clone);
        document.body.appendChild(exportHost);

        const options: Html2PdfOptions = {
            margin: [8, 8, 8, 8],
            filename: `${fileName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            enableLinks: true,
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
            },
            pagebreak: {
                mode: ['css', 'legacy'],
                avoid: ['.block-style-scope', '.timeline-card', '.bento-card'],
            },
        };

        setIsGeneratingPdf(true);

        try {
            const html2pdf = (await import('html2pdf.js')).default;
            await html2pdf().set(options).from(clone).save();
            setFeedback('downloaded');
        } catch (_error) {
            setFeedback('error');
        } finally {
            setIsGeneratingPdf(false);
            document.body.removeChild(exportHost);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        try {
            if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
                await navigator.share({
                    title: `${cleanName} | Hoja de Vida`,
                    text: cleanShareText,
                    url,
                });
                setFeedback('shared');
                return;
            }

            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                setFeedback('copied');
                return;
            }

            window.prompt('Copia este enlace para compartir la HV:', url);
            setFeedback('copied');
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            setFeedback('error');
        }
    };

    const feedbackLabel = {
        idle: 'Descarga en PDF o comparte este perfil.',
        downloaded: resumeUrl ? 'La HV se abrió en una nueva pestaña.' : 'La HV se descargó en PDF.',
        shared: 'La HV se compartió correctamente.',
        copied: 'El enlace de la HV se copió al portapapeles.',
        error: 'No fue posible descargar o compartir la HV desde este navegador.',
    }[feedback];

    return (
        <div className="mt-10 print:hidden" data-pdf-ignore="true">
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isGeneratingPdf}
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-zinc-800 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-zinc-200"
                    title={resumeUrl ? 'Descargar hoja de vida' : 'Descargar la hoja de vida en PDF'}
                >
                    <Download size={16} />
                    <span>{isGeneratingPdf ? 'Generando PDF...' : resumeUrl ? 'Descargar HV' : 'Descargar HV (PDF)'}</span>
                </button>

                <button
                    type="button"
                    onClick={handleShare}
                    disabled={isGeneratingPdf}
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-zinc-800 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-zinc-900"
                >
                    {feedback === 'shared' || feedback === 'copied' ? <Check size={16} /> : <Share2 size={16} />}
                    <span>{feedback === 'copied' ? 'Enlace Copiado' : 'Compartir HV'}</span>
                </button>
            </div>

            <p
                className={`mt-3 text-xs transition-colors ${feedback === 'error' ? 'text-rose-400' : 'text-slate-400'}`}
                aria-live="polite"
            >
                {isGeneratingPdf ? 'Preparando el PDF de la hoja de vida...' : feedbackLabel}
            </p>
        </div>
    );
}

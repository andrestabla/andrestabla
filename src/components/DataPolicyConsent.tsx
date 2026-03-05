'use client';

import { useEffect, useMemo, useState } from 'react';
import { CONSENT_EVENT_NAME, CONSENT_POLICY_VERSION, ConsentDecision, readStoredConsent, writeStoredConsent } from '@/lib/consent';

const POLICY_TITLE = 'Política de tratamiento de datos';

const POLICY_BULLETS = [
    'Ubicación geográfica aproximada por IP (país, región, ciudad).',
    'Páginas y secciones consultadas en el sitio.',
    'Tiempo de permanencia estimado por página.',
    'Eventos de interacción técnica para analítica operativa.',
];

const POLICY_PURPOSES = [
    'Mejorar experiencia de navegación y usabilidad.',
    'Medir interacción con páginas y secciones.',
    'Optimizar contenido y rendimiento del sitio.',
    'Generar trazabilidad de aceptación del consentimiento.',
];

const POLICY_SECTIONS = [
    {
        title: '1. Alcance y consentimiento',
        content:
            'El tratamiento descrito en esta política aplica a datos técnicos y de navegación recolectados en este sitio una vez otorgado el consentimiento. Puedes continuar sin analítica; en ese caso, no se registran eventos de navegación para fines analíticos.',
    },
    {
        title: '2. Datos tratados',
        content: 'No hay lista de datos configurada aún en el CMS. Puedes completarla en Admin > Configuración.',
    },
    {
        title: '3. Conservación y uso de la información',
        content:
            'Los datos de consentimiento y navegación se almacenan en infraestructura de servidor y base de datos asociada al sitio para analítica, operación y trazabilidad. Se utilizan de forma agregada y operativa, y no para decisiones automatizadas sobre el usuario final.',
    },
    {
        title: '4. Derechos del usuario',
        content:
            'Puedes negarte al uso de analítica mediante la opción “Continuar sin analítica”. También puedes revocar el consentimiento limpiando los datos locales del navegador (cookies/localStorage/sessionStorage) y dejando de usar el sitio.',
    },
    {
        title: '5. Texto administrado en CMS',
        content:
            'Tratamos datos de navegación con fines de analítica, mejora continua, seguridad y optimización de la experiencia digital. Esto puede incluir ubicación geográfica aproximada por IP, páginas y secciones visitadas y tiempo de permanencia estimado por página, una vez otorgado el consentimiento.',
    },
];

function dispatchConsentUpdated(decision: ConsentDecision) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
        new CustomEvent(CONSENT_EVENT_NAME, {
            detail: { decision, version: CONSENT_POLICY_VERSION },
        })
    );
}

export default function DataPolicyConsent() {
    const [isMounted, setIsMounted] = useState(false);
    const [decision, setDecision] = useState<ConsentDecision | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const stored = readStoredConsent();
        if (stored?.decision) {
            setDecision(stored.decision);
        }
    }, []);

    const shouldShowPrompt = useMemo(() => isMounted && !decision, [isMounted, decision]);

    const handleDecision = async (nextDecision: ConsentDecision) => {
        if (isSaving) return;
        setIsSaving(true);

        writeStoredConsent(nextDecision);
        dispatchConsentUpdated(nextDecision);
        setDecision(nextDecision);
        setShowPolicy(false);

        try {
            await fetch('/api/consent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    decision: nextDecision,
                    policyVersion: CONSENT_POLICY_VERSION,
                    path: window.location.pathname,
                }),
                keepalive: true,
            });
        } catch (_error) {
            // Ignore request errors on client. Local consent state is still applied.
        } finally {
            setIsSaving(false);
        }
    };

    if (!shouldShowPrompt) return null;

    return (
        <>
            <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" />

            <div className="fixed z-[91] left-3 right-3 bottom-3 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-4 md:p-5">
                <p className="text-[11px] uppercase tracking-widest font-bold text-[var(--brand)] mb-1">Política y Consentimiento</p>
                <h3 className="text-lg md:text-xl font-bold text-white">{POLICY_TITLE}</h3>
                <p className="text-[11px] text-zinc-400 mt-1">Versión {CONSENT_POLICY_VERSION}</p>

                <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
                    Usamos cookies y analítica de navegación para mejorar la experiencia, medir interacción y optimizar el contenido del sitio.
                    Puedes consultar el detalle de tratamiento y aceptar para continuar con analítica.
                </p>

                <div className="mt-4 flex flex-col md:flex-row gap-2">
                    <button
                        type="button"
                        onClick={() => setShowPolicy(true)}
                        className="flex-1 rounded-xl border border-zinc-700 text-zinc-200 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-[var(--brand)] hover:text-white transition-colors"
                    >
                        Leer política
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDecision('declined')}
                        disabled={isSaving}
                        className="flex-1 rounded-xl border border-zinc-700 text-zinc-200 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-zinc-500 transition-colors disabled:opacity-60"
                    >
                        Continuar sin analítica
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDecision('accepted')}
                        disabled={isSaving}
                        className="flex-1 rounded-xl bg-[var(--brand)] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-60"
                    >
                        Aceptar y continuar
                    </button>
                </div>
            </div>

            {showPolicy && (
                <div className="fixed inset-0 z-[92] flex items-center justify-center p-3 md:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPolicy(false)} />

                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                        <div className="px-4 md:px-6 py-4 border-b border-zinc-800 flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] uppercase tracking-widest font-bold text-[var(--brand)]">Política y Consentimiento</p>
                                <h4 className="text-lg font-bold text-white mt-1">{POLICY_TITLE}</h4>
                                <p className="text-[11px] text-zinc-400 mt-1">Versión {CONSENT_POLICY_VERSION}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPolicy(false)}
                                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-150px)] text-sm text-zinc-300 space-y-5">
                            <div>
                                <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Datos que podemos registrar</h5>
                                <ul className="list-disc pl-5 space-y-1.5">
                                    {POLICY_BULLETS.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Finalidad del tratamiento</h5>
                                <ul className="list-disc pl-5 space-y-1.5">
                                    {POLICY_PURPOSES.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {POLICY_SECTIONS.map((section) => (
                                <div key={section.title}>
                                    <h5 className="text-sm font-bold text-white mb-1">{section.title}</h5>
                                    <p className="leading-relaxed">{section.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="px-4 md:px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex flex-col md:flex-row gap-2">
                            <button
                                type="button"
                                onClick={() => handleDecision('declined')}
                                disabled={isSaving}
                                className="flex-1 rounded-xl border border-zinc-700 text-zinc-200 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-zinc-500 transition-colors disabled:opacity-60"
                            >
                                Continuar sin analítica
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDecision('accepted')}
                                disabled={isSaving}
                                className="flex-1 rounded-xl bg-[var(--brand)] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-60"
                            >
                                Aceptar y continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

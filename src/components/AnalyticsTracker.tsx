'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CONSENT_EVENT_NAME, CONSENT_POLICY_VERSION, readStoredConsent } from '@/lib/consent';

type TrackPayload = {
    eventType: 'page_view' | 'section_view';
    pagePath: string;
    sectionId?: string;
    sectionLabel?: string;
};

function getSectionLabel(element: HTMLElement): string {
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) return '';
    const text = (heading.textContent || '').replace(/\s+/g, ' ').trim();
    return text.slice(0, 220);
}

export default function AnalyticsTracker() {
    const pathname = usePathname() || '/';
    const [consentAccepted, setConsentAccepted] = useState(false);
    const sentPageViewsRef = useRef(new Set<string>());
    const sentSectionViewsRef = useRef(new Set<string>());

    useEffect(() => {
        const syncConsent = () => {
            const stored = readStoredConsent();
            setConsentAccepted(stored?.decision === 'accepted' && stored.version === CONSENT_POLICY_VERSION);
        };

        syncConsent();
        const handler = () => syncConsent();
        window.addEventListener(CONSENT_EVENT_NAME, handler as EventListener);

        return () => window.removeEventListener(CONSENT_EVENT_NAME, handler as EventListener);
    }, []);

    useEffect(() => {
        if (!consentAccepted) return;
        if (sentPageViewsRef.current.has(pathname)) return;

        sentPageViewsRef.current.add(pathname);

        const payload: TrackPayload = {
            eventType: 'page_view',
            pagePath: pathname,
        };

        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...payload,
                consentState: 'accepted',
                policyVersion: CONSENT_POLICY_VERSION,
            }),
            keepalive: true,
        }).catch(() => undefined);
    }, [consentAccepted, pathname]);

    useEffect(() => {
        if (!consentAccepted) return;

        const blockNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-block-id]'));
        if (blockNodes.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const target = entry.target as HTMLElement;
                    const blockId = target.dataset.blockId || target.id || '';
                    if (!blockId) return;

                    const sectionId = target.id || `block-${blockId}`;
                    const dedupeKey = `${pathname}::${sectionId}`;
                    if (sentSectionViewsRef.current.has(dedupeKey)) return;
                    sentSectionViewsRef.current.add(dedupeKey);

                    const sectionLabel = getSectionLabel(target);

                    fetch('/api/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            eventType: 'section_view',
                            consentState: 'accepted',
                            policyVersion: CONSENT_POLICY_VERSION,
                            pagePath: pathname,
                            sectionId,
                            sectionLabel,
                        }),
                        keepalive: true,
                    }).catch(() => undefined);
                });
            },
            { threshold: 0.5 }
        );

        blockNodes.forEach((node) => observer.observe(node));

        return () => observer.disconnect();
    }, [consentAccepted, pathname]);

    return null;
}

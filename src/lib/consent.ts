export const CONSENT_POLICY_VERSION = 'v1';
export const CONSENT_STORAGE_KEY = 'atr-consent';
export const CONSENT_EVENT_NAME = 'atr-consent-updated';

export type ConsentDecision = 'accepted' | 'declined';

type StoredConsent = {
    decision: ConsentDecision;
    version: string;
    timestamp: string;
};

export function readStoredConsent(): StoredConsent | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        if (parsed.version !== CONSENT_POLICY_VERSION) return null;
        if (parsed.decision !== 'accepted' && parsed.decision !== 'declined') return null;
        return {
            decision: parsed.decision,
            version: parsed.version,
            timestamp: typeof parsed.timestamp === 'string' ? parsed.timestamp : new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

export function writeStoredConsent(decision: ConsentDecision): StoredConsent | null {
    if (typeof window === 'undefined') return null;
    const payload: StoredConsent = {
        decision,
        version: CONSENT_POLICY_VERSION,
        timestamp: new Date().toISOString(),
    };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    return payload;
}

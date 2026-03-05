import { AnalyticsEventType, ConsentDecision } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CONSENT_POLICY_VERSION } from '@/lib/consent';

export type GeoContext = {
    country: string | null;
    region: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    userAgent: string | null;
};

function parseOptionalNumber(value: string | null): number | null {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function cleanString(value: string | null, maxLength = 120): string | null {
    const normalized = String(value || '').trim();
    if (!normalized) return null;
    return normalized.slice(0, maxLength);
}

export function getGeoContextFromRequest(request: Request): GeoContext {
    const headers = request.headers;
    return {
        country: cleanString(headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || null, 4),
        region: cleanString(headers.get('x-vercel-ip-country-region') || headers.get('x-vercel-ip-region') || null),
        city: cleanString(headers.get('x-vercel-ip-city') || null),
        latitude: parseOptionalNumber(headers.get('x-vercel-ip-latitude')),
        longitude: parseOptionalNumber(headers.get('x-vercel-ip-longitude')),
        userAgent: cleanString(headers.get('user-agent'), 300),
    };
}

export async function recordConsentDecision(params: {
    request: Request;
    decision: ConsentDecision;
    policyVersion?: string;
    path?: string | null;
}) {
    const geo = getGeoContextFromRequest(params.request);
    await prisma.consentRecord.create({
        data: {
            decision: params.decision,
            policyVersion: cleanString(params.policyVersion || CONSENT_POLICY_VERSION, 16) || CONSENT_POLICY_VERSION,
            path: cleanString(params.path || null, 240),
            country: geo.country,
            region: geo.region,
            city: geo.city,
            latitude: geo.latitude,
            longitude: geo.longitude,
            userAgent: geo.userAgent,
        },
    });
}

export async function recordAnalyticsEvent(params: {
    request: Request;
    eventType: AnalyticsEventType;
    consentState: string;
    policyVersion?: string;
    pagePath?: string | null;
    sectionId?: string | null;
    sectionLabel?: string | null;
    question?: string | null;
}) {
    if (params.consentState !== 'accepted') return;

    const geo = getGeoContextFromRequest(params.request);

    await prisma.analyticsEvent.create({
        data: {
            eventType: params.eventType,
            pagePath: cleanString(params.pagePath || null, 240),
            sectionId: cleanString(params.sectionId || null, 180),
            sectionLabel: cleanString(params.sectionLabel || null, 240),
            question: cleanString(params.question || null, 1200),
            policyVersion: cleanString(params.policyVersion || CONSENT_POLICY_VERSION, 16) || CONSENT_POLICY_VERSION,
            country: geo.country,
            region: geo.region,
            city: geo.city,
            latitude: geo.latitude,
            longitude: geo.longitude,
            userAgent: geo.userAgent,
        },
    });
}

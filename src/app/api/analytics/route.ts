import { AnalyticsEventType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics';
import { CONSENT_POLICY_VERSION } from '@/lib/consent';

const EVENT_TYPES = new Set<AnalyticsEventType>([
    'page_view',
    'section_view',
    'assistant_question',
]);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const eventType = body?.eventType as AnalyticsEventType;
        if (!EVENT_TYPES.has(eventType)) {
            return NextResponse.json({ error: 'Tipo de evento inválido.' }, { status: 400 });
        }

        const consentState = body?.consentState === 'accepted' ? 'accepted' : 'declined';
        const policyVersion =
            typeof body?.policyVersion === 'string' && body.policyVersion.trim()
                ? body.policyVersion.trim().slice(0, 16)
                : CONSENT_POLICY_VERSION;

        await recordAnalyticsEvent({
            request,
            eventType,
            consentState,
            policyVersion,
            pagePath: typeof body?.pagePath === 'string' ? body.pagePath : null,
            sectionId: typeof body?.sectionId === 'string' ? body.sectionId : null,
            sectionLabel: typeof body?.sectionLabel === 'string' ? body.sectionLabel : null,
            question: typeof body?.question === 'string' ? body.question : null,
        });

        return NextResponse.json({ ok: true });
    } catch (_error) {
        return NextResponse.json({ error: 'No fue posible registrar analítica.' }, { status: 500 });
    }
}

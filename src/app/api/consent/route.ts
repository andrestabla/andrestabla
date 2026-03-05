import { NextResponse } from 'next/server';
import { recordConsentDecision } from '@/lib/analytics';
import { CONSENT_POLICY_VERSION } from '@/lib/consent';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const decision = body?.decision === 'accepted' ? 'accepted' : body?.decision === 'declined' ? 'declined' : null;
        if (!decision) {
            return NextResponse.json({ error: 'Decisión inválida.' }, { status: 400 });
        }

        const policyVersion =
            typeof body?.policyVersion === 'string' && body.policyVersion.trim()
                ? body.policyVersion.trim().slice(0, 16)
                : CONSENT_POLICY_VERSION;
        const path = typeof body?.path === 'string' ? body.path.slice(0, 240) : null;

        await recordConsentDecision({
            request,
            decision,
            policyVersion,
            path,
        });

        return NextResponse.json({ ok: true });
    } catch (_error) {
        return NextResponse.json({ error: 'No fue posible registrar el consentimiento.' }, { status: 500 });
    }
}

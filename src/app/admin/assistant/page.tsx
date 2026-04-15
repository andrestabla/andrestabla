import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AssistantSettingsForm from '../components/AssistantSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminAssistantPage() {
    let siteSettings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });

    if (!siteSettings) {
        siteSettings = await prisma.siteSettings.create({
            data: {
                id: 'global',
                title: 'Mi Sitio',
                description: '',
                globalStyles: JSON.stringify({
                    primaryColor: '#4f46e5',
                    fontFamily: 'Inter',
                    logoUrl: '',
                    loaderEnabled: true,
                }),
            },
        });
    }

    const serializedSettings = JSON.parse(JSON.stringify(siteSettings));

    return (
        <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-200 md:px-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--brand)]">Módulo del Asistente</p>
                        <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">Configuración del Asistente IA</h1>
                    </div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
                    >
                        Volver al Builder
                    </Link>
                </div>

                <AssistantSettingsForm settings={serializedSettings} />
            </div>
        </main>
    );
}

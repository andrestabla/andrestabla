import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type GeoPoint = {
    key: string;
    country: string;
    region: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    hits: number;
};

function formatCount(value: number): string {
    return new Intl.NumberFormat('es-CO').format(value);
}

function mapX(longitude: number) {
    return ((longitude + 180) / 360) * 1000;
}

function mapY(latitude: number) {
    return ((90 - latitude) / 180) * 460;
}

function sanitizeGeo(value: string | null | undefined, fallback: string): string {
    const text = String(value || '').trim();
    return text || fallback;
}

export default async function AdminAnalyticsPage() {
    const [consentSummary, consentGeoGrouped, sectionsGrouped, questionsGrouped, recentQuestions] = await Promise.all([
        prisma.consentRecord.groupBy({
            by: ['decision'],
            _count: { _all: true },
        }),
        prisma.consentRecord.groupBy({
            by: ['country', 'region', 'city', 'latitude', 'longitude'],
            _count: { _all: true },
        }),
        prisma.analyticsEvent.groupBy({
            by: ['sectionId', 'sectionLabel', 'pagePath'],
            where: { eventType: 'section_view' },
            _count: { _all: true },
        }),
        prisma.analyticsEvent.groupBy({
            by: ['question', 'pagePath'],
            where: {
                eventType: 'assistant_question',
                question: { not: null },
            },
            _count: { _all: true },
        }),
        prisma.analyticsEvent.findMany({
            where: {
                eventType: 'assistant_question',
                question: { not: null },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                question: true,
                pagePath: true,
                country: true,
                city: true,
                createdAt: true,
            },
        }),
    ]);

    const accepted = consentSummary.find((item) => item.decision === 'accepted')?._count._all || 0;
    const declined = consentSummary.find((item) => item.decision === 'declined')?._count._all || 0;
    const totalConsents = accepted + declined;

    const geoPoints: GeoPoint[] = consentGeoGrouped
        .map((row) => ({
        key: `${row.country || 'NA'}-${row.region || 'NA'}-${row.city || 'NA'}-${row.latitude ?? 'NA'}-${row.longitude ?? 'NA'}`,
        country: sanitizeGeo(row.country, 'N/D'),
        region: sanitizeGeo(row.region, 'N/D'),
        city: sanitizeGeo(row.city, 'N/D'),
        latitude: row.latitude,
        longitude: row.longitude,
        hits: row._count._all,
        }))
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 100);

    const topSections = sectionsGrouped
        .sort((a, b) => b._count._all - a._count._all)
        .slice(0, 25);

    const topQuestions = questionsGrouped
        .sort((a, b) => b._count._all - a._count._all)
        .slice(0, 30);

    const mapPoints = geoPoints
        .filter((point) => typeof point.latitude === 'number' && typeof point.longitude === 'number')
        .map((point) => ({
            ...point,
            x: mapX(point.longitude as number),
            y: mapY(point.latitude as number),
            r: Math.max(3, Math.min(16, 3 + Math.log10(point.hits + 1) * 6)),
        }));

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-200 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <p className="text-[11px] uppercase tracking-widest text-[var(--brand)] font-bold">Módulo de Analítica</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">Consentimiento, geografía y comportamiento</h1>
                    </div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                    >
                        Volver al Builder
                    </Link>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-[11px] uppercase tracking-widest text-zinc-400">Aceptaron</p>
                        <p className="text-3xl font-bold text-emerald-400 mt-2">{formatCount(accepted)}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-[11px] uppercase tracking-widest text-zinc-400">Declinaron</p>
                        <p className="text-3xl font-bold text-amber-400 mt-2">{formatCount(declined)}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-[11px] uppercase tracking-widest text-zinc-400">Total respuestas</p>
                        <p className="text-3xl font-bold text-white mt-2">{formatCount(totalConsents)}</p>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-4">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-3">Mapa global de accesos</h2>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                            <svg viewBox="0 0 1000 460" className="w-full h-auto">
                                <rect x="0" y="0" width="1000" height="460" fill="#09090b" />
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <line
                                        key={`lat-${n}`}
                                        x1="0"
                                        y1={n * (460 / 6)}
                                        x2="1000"
                                        y2={n * (460 / 6)}
                                        stroke="#18181b"
                                        strokeWidth="1"
                                    />
                                ))}
                                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                    <line
                                        key={`lon-${n}`}
                                        x1={n * (1000 / 8)}
                                        y1="0"
                                        x2={n * (1000 / 8)}
                                        y2="460"
                                        stroke="#18181b"
                                        strokeWidth="1"
                                    />
                                ))}
                                {mapPoints.map((point) => (
                                    <g key={point.key}>
                                        <circle cx={point.x} cy={point.y} r={point.r + 2} fill="rgba(84,182,242,0.22)" />
                                        <circle cx={point.x} cy={point.y} r={point.r} fill="#54b6f2" fillOpacity="0.9" />
                                    </g>
                                ))}
                                <text x="16" y="24" fill="#71717a" fontSize="11">Proyección simple lat/lon (consentimientos registrados)</text>
                            </svg>
                        </div>
                        {mapPoints.length === 0 && (
                            <p className="text-xs text-zinc-500 mt-2">Aún no hay coordenadas disponibles para mapear accesos.</p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-3">Tabla de ubicaciones</h2>
                        <div className="max-h-[430px] overflow-auto rounded-xl border border-zinc-800">
                            <table className="w-full text-xs">
                                <thead className="bg-zinc-950 sticky top-0">
                                    <tr className="text-zinc-400">
                                        <th className="text-left px-3 py-2 font-semibold">País</th>
                                        <th className="text-left px-3 py-2 font-semibold">Región</th>
                                        <th className="text-left px-3 py-2 font-semibold">Ciudad</th>
                                        <th className="text-right px-3 py-2 font-semibold">Accesos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {geoPoints.map((row) => (
                                        <tr key={row.key} className="border-t border-zinc-800">
                                            <td className="px-3 py-2">{row.country}</td>
                                            <td className="px-3 py-2">{row.region}</td>
                                            <td className="px-3 py-2">{row.city}</td>
                                            <td className="px-3 py-2 text-right font-semibold">{formatCount(row.hits)}</td>
                                        </tr>
                                    ))}
                                    {geoPoints.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-3 py-6 text-center text-zinc-500">
                                                Sin datos de geografía todavía.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-3">Secciones más consultadas</h2>
                        <div className="space-y-2">
                            {topSections.map((row, idx) => (
                                <div key={`${row.sectionId || idx}-${row.pagePath || ''}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                                    <p className="text-xs text-white font-semibold">
                                        {row.sectionLabel || row.sectionId || 'Sección sin etiqueta'}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 mt-1">
                                        {row.pagePath || '/'} · {formatCount(row._count._all)} vistas
                                    </p>
                                </div>
                            ))}
                            {topSections.length === 0 && (
                                <p className="text-xs text-zinc-500">Aún no hay eventos de secciones.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-3">Preguntas al asistente IA</h2>
                        <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                            {topQuestions.map((row, idx) => (
                                <div key={`${row.question || idx}-${row.pagePath || ''}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                                    <p className="text-xs text-white leading-relaxed">{row.question}</p>
                                    <p className="text-[11px] text-zinc-500 mt-1">
                                        {row.pagePath || '/'} · {formatCount(row._count._all)} veces
                                    </p>
                                </div>
                            ))}
                            {topQuestions.length === 0 && (
                                <p className="text-xs text-zinc-500">Aún no se han registrado preguntas.</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-3">Preguntas recientes</h2>
                    <div className="space-y-2">
                        {recentQuestions.map((row, idx) => (
                            <div key={`${row.createdAt.toISOString()}-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                                <p className="text-xs text-white leading-relaxed">{row.question}</p>
                                <p className="text-[11px] text-zinc-500 mt-1">
                                    {(row.country || 'N/D')}{row.city ? `, ${row.city}` : ''} · {row.pagePath || '/'} · {new Date(row.createdAt).toLocaleString('es-CO')}
                                </p>
                            </div>
                        ))}
                        {recentQuestions.length === 0 && (
                            <p className="text-xs text-zinc-500">No hay actividad reciente registrada.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

'use client';

import { safeHtml } from '@/lib/html';

export default function RichTextBlock({ data }: { data: any }) {
    return (
        <section className="relative w-full py-24 border-t border-zinc-900">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start">

                {data.title && (
                    <div className="md:w-1/3 shrink-0 relative">
                        <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight sticky top-24" style={{ fontFamily: 'var(--font-heading)' }} dangerouslySetInnerHTML={safeHtml(data.title)} />
                        <div className="w-12 h-[2px] bg-[var(--brand)] mt-6"></div>
                    </div>
                )}

                <div className="md:w-2/3">
                    <div
                        className="text-lg md:text-xl text-slate-400 leading-relaxed font-light prose prose-invert prose-p:mb-6 prose-a:text-[var(--brand)] hover:prose-a:text-white transition-colors"
                        dangerouslySetInnerHTML={safeHtml(data.content, 'Escribe tu contenido aquí...')}
                    />
                </div>

            </div>
        </section>
    );
}

'use client';

export default function RichTextBlock({ data }: { data: any }) {
    return (
        <section className="relative w-full">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full translate-y-10 -z-10"></div>
            <div className="bg-white/80 backdrop-blur-md border border-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {data.title && (
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-4">
                        <span>{data.title}</span>
                        <div className="h-[1px] flex-1 bg-slate-200"></div>
                    </h3>
                )}
                <div
                    className="text-lg md:text-2xl text-slate-700 leading-relaxed font-light prose prose-slate"
                    dangerouslySetInnerHTML={{ __html: data.content || 'Escribe tu contenido aquí...' }}
                />
            </div>
        </section>
    );
}

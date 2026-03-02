'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { safeHtml } from '@/lib/html';

export default function AccordionBlock({ data }: { data: any }) {
    const items = data.items || [];
    const title = data.title || '';
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="w-full flex flex-col gap-4">
            {title && <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2" dangerouslySetInnerHTML={safeHtml(title)} />}
            {items.map((item: any, i: number) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex justify-between items-center p-5 text-left bg-zinc-50 hover:bg-zinc-100 transition-colors"
                    >
                        <span className="font-semibold text-slate-800" dangerouslySetInnerHTML={safeHtml(item.question, 'Pregunta...')} />
                        {openIndex === i ? <ChevronUp size={20} className="text-indigo-500" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </button>
                    {openIndex === i && (
                        <div className="p-5 text-slate-600 leading-relaxed border-t border-slate-100 bg-white animate-in slide-in-from-top-2" dangerouslySetInnerHTML={safeHtml(item.answer, 'Respuesta...')} />
                    )}
                </div>
            ))}
        </div>
    );
}

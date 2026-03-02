import React from 'react';
import { Quote } from 'lucide-react';
import { safeHtml } from '@/lib/html';

export default function TestimonialBlock({ data }: { data: any }) {
    const quote = data.quote || 'Excelente profesional, una experiencia increíble de trabajo.';
    const author = data.author || 'Jane Doe';
    const role = data.role || 'CEO, Company Inc.';
    const avatar = data.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026024d';

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 md:p-10 rounded-3xl shadow-lg relative group transition-all hover:-translate-y-1 hover:shadow-xl">
            <Quote className="absolute top-6 right-6 text-indigo-500/10 dark:text-indigo-500/20 w-16 h-16 pointer-events-none" />

            <p className="text-slate-700 dark:text-zinc-300 text-lg md:text-xl font-medium leading-relaxed italic mb-8 relative z-10">
                {'"'}<span dangerouslySetInnerHTML={safeHtml(quote)} />{'"'}
            </p>

            <div className="flex items-center gap-4 relative z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt={author} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-zinc-800" />
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm" dangerouslySetInnerHTML={safeHtml(author)} />
                    <span className="text-xs uppercase tracking-widest font-semibold text-indigo-500" dangerouslySetInnerHTML={safeHtml(role)} />
                </div>
            </div>
        </div>
    );
}

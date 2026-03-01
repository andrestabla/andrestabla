'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

export default function PricingBlock({ data }: { data: any }) {
    const title = data.title || 'Membresía Pro';
    const price = data.price || '$99';
    const period = data.period || '/mes';
    const format = data.format || 'card'; // card, minimalist
    const color = data.color || 'bg-indigo-500';
    const buttonText = data.buttonText || 'Comenzar Ahora';
    const buttonLink = data.buttonLink || '#';
    const isPopular = data.isPopular !== undefined ? data.isPopular : false;

    const features = data.features || [
        { text: 'Acceso total a los cursos', included: true },
        { text: 'Soporte 24/7', included: true },
        { text: 'Certificado físico', included: false }
    ];

    if (format === 'minimalist') {
        return (
            <div className={`w-full relative flex flex-col md:flex-row items-center justify-between p-8 bg-white dark:bg-zinc-900 border ${isPopular ? 'border-indigo-500 shadow-lg dark:shadow-indigo-500/20' : 'border-slate-200 dark:border-zinc-800'} rounded-2xl transition-all duration-300 hover:shadow-xl`}>
                {isPopular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-[10px] uppercase tracking-widest font-bold rounded-full">Más Popular</div>}

                <div className="flex-1 md:pr-8 mb-6 md:mb-0 text-center md:text-left">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2">{title}</h3>
                    <ul className="space-y-2 mt-4 text-left">
                        {features.map((feat: any, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                                {feat.included ? <Check size={16} className="text-emerald-500 flex-shrink-0" /> : <X size={16} className="text-rose-400 opacity-50 flex-shrink-0" />}
                                <span className={!feat.included ? 'line-through opacity-70' : ''}>{feat.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-center justify-center min-w-[200px] md:border-l border-slate-100 dark:border-zinc-800 md:pl-8">
                    <div className="flex items-baseline mb-4">
                        <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{price}</span>
                        <span className="text-sm font-bold text-slate-400 dark:text-zinc-500 ml-1">{period}</span>
                    </div>
                    <a href={buttonLink} className={`w-full py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-center transition-all shadow-md hover:shadow-lg ${isPopular ? `${color} text-white` : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
                        {buttonText}
                    </a>
                </div>
            </div>
        );
    }

    // Default Card format
    return (
        <div className={`w-full max-w-sm mx-auto relative flex flex-col p-8 bg-white dark:bg-zinc-900 border ${isPopular ? 'border-none ring-2 ring-indigo-500 shadow-2xl scale-105' : 'border-slate-200 dark:border-zinc-800 shadow-sm'} rounded-3xl transition-all duration-300 hover:-translate-y-2`}>
            {isPopular && <div className={`absolute top-0 inset-x-0 h-2 rounded-t-3xl ${color}`}></div>}
            {isPopular && <div className={`absolute -top-4 right-8 px-4 py-1.5 ${color} text-white text-[9px] uppercase tracking-widest font-black rounded-full shadow-lg`}>Popular</div>}

            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{title}</h3>

            <div className="flex items-baseline my-6">
                <span className="text-5xl font-heading font-black tracking-tighter text-slate-900 dark:text-white">{price}</span>
                <span className="text-sm font-bold text-slate-500 dark:text-zinc-500 ml-2">{period}</span>
            </div>

            <div className="border-t border-slate-100 dark:border-zinc-800 my-6"></div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feat: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400 font-medium">
                        {feat.included ? (
                            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mt-0.5">
                                <Check size={12} strokeWidth={3} />
                            </div>
                        ) : (
                            <div className="p-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 mt-0.5">
                                <X size={12} strokeWidth={3} />
                            </div>
                        )}
                        <span className={!feat.included ? 'line-through opacity-70' : ''}>{feat.text}</span>
                    </li>
                ))}
            </ul>

            <a href={buttonLink} className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-center transition-all shadow-md hover:shadow-lg ${isPopular ? `${color} text-white hover:brightness-110` : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-700'}`}>
                {buttonText}
            </a>
        </div>
    );
}

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { safeHtml } from '@/lib/html';

export default function CallToActionBlock({ data }: { data: any }) {
    const title = data.title || '¿Listo para empezar tu proyecto?';
    const subtitle = data.subtitle || 'Hablemos sobre diseño, tecnología y cómo llevar tu marca al siguiente nivel.';
    const buttonText = data.buttonText || 'Agenda una llamada';
    const buttonLink = data.buttonLink || '#';
    const bgImage = data.bgImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop';

    // Style Variants
    const style = data.style || 'cover'; // cover, banner, split

    if (style === 'split') {
        return (
            <div className="w-full flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800">
                <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center bg-indigo-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl scale-150">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-white">
                            <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,80.7,-46.2C89.6,-33.3,94.5,-16.7,92.5,-1.2C90.5,14.4,81.7,28.8,71.5,41.2C61.3,53.6,49.8,64.1,36.5,72.2C23.2,80.3,8.2,86,-6.6,83.9C-21.4,81.8,-36.1,72,-49,60.8C-61.9,49.6,-73.1,37,-80.6,22.2C-88.1,7.4,-92,-9.5,-87.3,-24.1C-82.6,-38.7,-69.3,-50.9,-55.4,-58.5C-41.5,-66.1,-27.1,-69,-12.3,-71.3C2.5,-73.6,17.2,-75.4,30.3,-77.8C43.4,-80.2,55.1,-83.2,44.7,-76.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10 leading-tight" dangerouslySetInnerHTML={safeHtml(title)} />
                    <div className="rich-html text-indigo-100 font-medium text-lg mb-8 relative z-10" dangerouslySetInnerHTML={safeHtml(subtitle)} />
                    <div className="relative z-10">
                        <a href={buttonLink} className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            <span dangerouslySetInnerHTML={safeHtml(buttonText)} /> <ArrowRight size={16} className="ml-2" />
                        </a>
                    </div>
                </div>
                <div className="w-full md:w-1/2 min-h-[300px] md:min-h-full bg-cover bg-center relative group">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url(${bgImage})` }}></div>
                </div>
            </div>
        );
    }

    if (style === 'banner') {
        return (
            <div className="w-full relative overflow-hidden rounded-2xl bg-indigo-50 dark:bg-zinc-800/50 border border-indigo-100 dark:border-zinc-700/50 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3" dangerouslySetInnerHTML={safeHtml(title)} />
                    <div className="rich-html text-slate-600 dark:text-zinc-400 font-medium" dangerouslySetInnerHTML={safeHtml(subtitle)} />
                </div>
                <div className="flex-shrink-0">
                    <a href={buttonLink} className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all">
                        <span dangerouslySetInnerHTML={safeHtml(buttonText)} />
                    </a>
                </div>
            </div>
        );
    }

    // Default Cover
    return (
        <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[400px] py-20 px-6 group">
            <div className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url(${bgImage})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>

            <div className="relative z-10 text-center max-w-3xl flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg" dangerouslySetInnerHTML={safeHtml(title)} />
                <div className="rich-html text-xl md:text-2xl font-medium text-white/80 mb-10 max-w-2xl drop-shadow-md" dangerouslySetInnerHTML={safeHtml(subtitle)} />
                <a href={buttonLink} className="inline-flex items-center justify-center px-8 py-4 bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-indigo-600 hover:-translate-y-1 hover:shadow-indigo-500/25 transition-all">
                    <span dangerouslySetInnerHTML={safeHtml(buttonText)} /> <ArrowRight size={16} className="ml-2" />
                </a>
            </div>
        </div>
    );
}

import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    website: Globe,
    email: Mail
};

export default function SocialBlock({ data }: { data: any }) {
    const size = data.size || 'w-10 h-10';
    const style = data.style || 'outline'; // outline, solid, ghost
    const alignment = data.alignment || 'justify-center';
    const items = data.items || [
        { network: 'linkedin', url: '#' },
        { network: 'github', url: '#' },
        { network: 'twitter', url: '#' }
    ];

    let baseClass = "flex items-center justify-center rounded-full transition-all duration-300";
    if (style === 'outline') baseClass += " border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-500";
    if (style === 'solid') baseClass += " bg-indigo-500 text-white hover:bg-indigo-600 shadow-md";
    if (style === 'ghost') baseClass += " text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 dark:text-zinc-400 hover:text-indigo-500";

    return (
        <div className={`w-full flex gap-3 ${alignment}`}>
            {items.map((item: any, idx: number) => {
                const IconComponent = ICON_MAP[item.network] || Globe;
                return (
                    <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${baseClass} ${size}`}
                        aria-label={item.network}
                    >
                        <IconComponent size={size.includes('12') ? 24 : 18} />
                    </a>
                );
            })}
        </div>
    );
}

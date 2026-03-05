import React from 'react';
import { safeHtml } from '@/lib/html';

export default function ButtonBlock({ data }: { data: any }) {
    const text = data.text || 'Haz clic aquí';
    const link = data.link || '#';
    const openInNewTab = Boolean(data.openInNewTab);
    const style = data.style || 'primary'; // primary, secondary, outline, ghost
    const size = data.size || 'md'; // sm, md, lg
    const align = data.align || 'text-left'; // text-left, text-center, text-right

    // Base styling
    const baseClasses = "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 rounded-full";

    // Style Variants
    let styleClasses = "";
    if (style === 'primary') styleClasses = "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg";
    if (style === 'secondary') styleClasses = "bg-slate-800 text-white hover:bg-slate-900 shadow-md hover:shadow-lg";
    if (style === 'outline') styleClasses = "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50";
    if (style === 'ghost') styleClasses = "text-indigo-600 hover:bg-indigo-50";

    // Size Variants
    let sizeClasses = "";
    if (size === 'sm') sizeClasses = "px-4 py-2 text-[10px]";
    if (size === 'md') sizeClasses = "px-6 py-3 text-xs";
    if (size === 'lg') sizeClasses = "px-8 py-4 text-sm";

    return (
        <div className={`w-full ${align}`}>
            <a
                href={link}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
                className={`${baseClasses} ${styleClasses} ${sizeClasses}`}
            >
                <span dangerouslySetInnerHTML={safeHtml(text, 'Haz clic aquí')} />
            </a>
        </div>
    );
}

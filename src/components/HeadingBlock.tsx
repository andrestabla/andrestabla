import React from 'react';
import { safeHtml } from '@/lib/html';

export default function HeadingBlock({ data }: { data: any }) {
    const text = data.text || 'Nuevo Encabezado';
    const tag = data.tag || 'h2';
    const align = data.align || 'text-left';
    const rawColor = typeof data.color === 'string' ? data.color.trim() : '';
    const colorClass = rawColor && rawColor.startsWith('text-') ? rawColor : 'text-slate-900';
    const fallbackInlineColor = rawColor && !rawColor.startsWith('text-') ? rawColor : 'currentColor';

    // Use React.createElement to dynamically render h1, h2, h3, etc.
    return React.createElement(
        tag,
        {
            className: `w-full font-heading font-bold tracking-tight ${align} ${colorClass} ${tag === 'h1' ? 'text-5xl md:text-7xl mb-6' :
                    tag === 'h2' ? 'text-4xl md:text-5xl mb-5' :
                        tag === 'h3' ? 'text-3xl md:text-4xl mb-4' :
                            tag === 'h4' ? 'text-2xl md:text-3xl mb-3' :
                                tag === 'h5' ? 'text-xl md:text-2xl mb-2' :
                                    'text-lg md:text-xl mb-2'
                }`,
            style: { color: `var(--block-heading, ${fallbackInlineColor})` },
            dangerouslySetInnerHTML: safeHtml(text, 'Nuevo Encabezado')
        }
    );
}

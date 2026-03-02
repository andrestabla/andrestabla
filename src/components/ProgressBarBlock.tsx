import React from 'react';
import { safeHtml } from '@/lib/html';

export default function ProgressBarBlock({ data }: { data: any }) {
    const items = data.items || [
        { label: 'React / Next.js', percentage: 90 },
        { label: 'Tailwind CSS', percentage: 95 },
        { label: 'Node.js / Express', percentage: 80 }
    ];

    // Config
    const color = data.color || 'bg-indigo-500';
    const showPercentage = data.showPercentage !== undefined ? data.showPercentage : true;
    const thickness = data.thickness || 'h-2';

    return (
        <div className="w-full space-y-6">
            {items.map((item: any, idx: number) => (
                <div key={idx} className="w-full">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-zinc-300" dangerouslySetInnerHTML={safeHtml(item.label)} />
                        {showPercentage && <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">{item.percentage}%</span>}
                    </div>
                    <div className={`w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden ${thickness}`}>
                        <div
                            className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${item.percentage}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

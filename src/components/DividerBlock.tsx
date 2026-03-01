import React from 'react';

export default function DividerBlock({ data }: { data: any }) {
    const style = data.style || 'solid'; // solid, dashed, dotted
    const thickness = data.thickness || 'border-t'; // border-t, border-t-2, border-t-4
    const color = data.color || 'border-slate-200';
    const width = data.width || 'w-full'; // w-full, w-1/2, w-1/4, mx-auto

    return (
        <div className="w-full py-4 flex items-center justify-center">
            <hr className={`${width} ${thickness} ${style} ${color}`} />
        </div>
    );
}

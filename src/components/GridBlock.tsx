import React from 'react';

// GridBlock serves as a container. It expects child components to be passed to it.
export default function GridBlock({ data, childrenNodes, isEditor }: { data: any, childrenNodes: React.ReactNode, isEditor?: boolean }) {

    const columns = parseInt(data.columns) || 1;

    let gridClass = "grid-cols-1";
    if (columns === 2) gridClass = "grid-cols-1 md:grid-cols-2";
    if (columns === 3) gridClass = "grid-cols-1 md:grid-cols-3";
    if (columns === 4) gridClass = "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

    return (
        <div className={`w-full py-12 grid ${gridClass} gap-6 md:gap-12 relative ${isEditor ? 'border border-dashed border-indigo-200 hover:border-indigo-400 p-4 rounded-xl transition-colors' : ''}`}>
            {/* Render children passed down from BlockRenderer */}
            {childrenNodes}

            {isEditor && (
                <div className="col-span-full mt-4 flex justify-center">
                    <button className="bg-white border border-dashed border-indigo-300 text-indigo-500 px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-50 pointer-events-none opacity-50 group-hover/block:opacity-100 transition-opacity">
                        + Insertar en {columns} columnas
                    </button>
                </div>
            )}
        </div>
    );
}

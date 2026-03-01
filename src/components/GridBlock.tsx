import React from 'react';

// GridBlock serves as a container. It expects child components to be passed to it.
export default function GridBlock({ data, childrenNodes, isEditor }: { data: any, childrenNodes: React.ReactNode, isEditor?: boolean }) {

    const columns = parseInt(data.columns) || 1;

    let gridClass = "grid-cols-1";
    if (columns === 2) gridClass = "grid-cols-1 md:grid-cols-2";
    if (columns === 3) gridClass = "grid-cols-1 md:grid-cols-3";
    if (columns === 4) gridClass = "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

    const hasChildren = React.Children.count(childrenNodes) > 0;

    return (
        <div className={`w-full py-12 grid ${gridClass} gap-6 md:gap-12 relative ${isEditor && !hasChildren ? 'min-h-[200px] border-2 border-dashed border-indigo-500/50 bg-indigo-50/10 rounded-xl place-items-center' : ''}`}>
            {/* Render children passed down from BlockRenderer */}
            {!hasChildren && isEditor ? (
                <div className="col-span-full text-center text-sm text-indigo-400 font-bold uppercase tracking-widest pointer-events-none">
                    [ Cuadrícula Vacía - Haz clic aquí para inyectar un Widget ]
                </div>
            ) : childrenNodes}
        </div>
    );
}

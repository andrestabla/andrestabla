import React from 'react';

// GridBlock serves as a container. It expects child components to be passed to it.
export default function GridBlock({ data, childrenNodes }: { data: any, childrenNodes: React.ReactNode }) {

    // Parse grid columns from data or default to 1 (full width)
    // Options: 1, 2, 3, 4
    const columns = parseInt(data.columns) || 1;

    let gridClass = "grid-cols-1";
    if (columns === 2) gridClass = "grid-cols-1 md:grid-cols-2";
    if (columns === 3) gridClass = "grid-cols-1 md:grid-cols-3";
    if (columns === 4) gridClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

    return (
        <div className={`w-full py-12 grid ${gridClass} gap-6 md:gap-12 relative`}>
            {/* Render children passed down from BlockRenderer */}
            {childrenNodes}
        </div>
    );
}

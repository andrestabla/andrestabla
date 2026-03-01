import React from 'react';

export default function SpacerBlock({ data }: { data: any }) {
    const height = data.height || 'h-12'; // h-8, h-12, h-24, h-32

    return (
        <div className={`w-full ${height} pointer-events-none opacity-0`} aria-hidden="true" />
    );
}

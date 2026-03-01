'use client';

import { useEffect } from "react";

export default function ClickToEditWrapper() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Find if a block was clicked by ascending the DOM tree
            const target = e.target as HTMLElement;
            const blockElement = target.closest('[data-block-id]');

            if (blockElement && window !== window.top) {
                e.preventDefault();
                e.stopPropagation();

                const blockId = blockElement.getAttribute('data-block-id');
                window.parent.postMessage({ type: 'BLOCK_SELECTED', blockId }, '*');
            }
        };

        // Only attach if we are inside the admin iframe
        if (window !== window.top) {
            document.addEventListener('click', handleClick, true); // Use capture phase
        }

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, []);

    return null;
}

'use client';

import { useEffect } from "react";

export default function ClickToEditWrapper() {
    useEffect(() => {
        // ── OUTBOUND: Click on any [data-block-id] → tell the parent shell which block
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const blockEl = target.closest('[data-block-id]');
            if (blockEl && window !== window.top) {
                e.preventDefault();
                e.stopPropagation();
                const blockId = blockEl.getAttribute('data-block-id');
                const blockType = blockEl.querySelector('[data-block-id]')?.getAttribute('data-block-id') || blockId;
                window.parent.postMessage({ type: 'BLOCK_SELECTED', blockId }, '*');
            }
        };

        // ── INBOUND: Parent tells us which block is active → we draw a persistent ring
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'HIGHLIGHT_BLOCK') {
                // Remove old rings
                document.querySelectorAll('[data-block-active="true"]').forEach(el => {
                    (el as HTMLElement).removeAttribute('data-block-active');
                    (el as HTMLElement).style.removeProperty('outline');
                    (el as HTMLElement).style.removeProperty('outline-offset');
                });

                const { blockId } = event.data;
                if (!blockId) return;
                const target = document.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement;
                if (target) {
                    target.setAttribute('data-block-active', 'true');
                    target.style.outline = '2px solid #6366f1';   // indigo-500
                    target.style.outlineOffset = '-2px';
                    // Smooth scroll into view if it's not visible
                    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        };

        if (window !== window.top) {
            document.addEventListener('click', handleClick, true);
            window.addEventListener('message', handleMessage);
        }

        return () => {
            document.removeEventListener('click', handleClick, true);
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return null;
}

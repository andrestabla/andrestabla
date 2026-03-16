'use client';

import React from 'react';
import HeadingBlock from '@/components/HeadingBlock';
import HeroBlock from '@/components/HeroBlock';
import RichTextBlock from '@/components/RichTextBlock';
import TimelineBlock from '@/components/TimelineBlock';
import BentoGridBlock from '@/components/BentoGridBlock';
import GridBlock from '@/components/GridBlock';
import VideoBlock from '@/components/VideoBlock';
import EmbedBlock from '@/components/EmbedBlock';
import ImageBlock from '@/components/ImageBlock';
import AccordionBlock from '@/components/AccordionBlock';
import CarouselBlock from '@/components/CarouselBlock';
import ButtonBlock from '@/components/ButtonBlock';
import DividerBlock from '@/components/DividerBlock';
import SpacerBlock from '@/components/SpacerBlock';
import FormBlock from '@/components/FormBlock';
import TestimonialBlock from '@/components/TestimonialBlock';
import SocialBlock from '@/components/SocialBlock';
import MapBlock from '@/components/MapBlock';
import ProgressBarBlock from '@/components/ProgressBarBlock';
import TabsBlock from '@/components/TabsBlock';
import ToggleBlock from '@/components/ToggleBlock';
import GalleryBlock from '@/components/GalleryBlock';
import CounterBlock from '@/components/CounterBlock';
import LottieBlock from '@/components/LottieBlock';
import PricingBlock from '@/components/PricingBlock';
import FlipBoxBlock from '@/components/FlipBoxBlock';
import CallToActionBlock from '@/components/CallToActionBlock';
import NavMenuBlock from '@/components/NavMenuBlock';
import PortfolioBlock from '@/components/PortfolioBlock';
import HotspotsBlock from '@/components/HotspotsBlock';
import LoopGridBlock from '@/components/LoopGridBlock';
import BlockBackgroundVideo from '@/components/BlockBackgroundVideo';
import { resolveBackgroundMediaUrls } from '@/lib/backgroundVideo';
import { buildBlockInlineStyles, buildFullBleedBackgroundStyle, resolveBackgroundOverlay } from '@/lib/blockStyles';

const BlockComponents: Record<string, any> = {
    hero: HeroBlock,
    richtext: RichTextBlock,
    timeline: TimelineBlock,
    bento: BentoGridBlock,
    grid: GridBlock,
    video: VideoBlock,
    embed: EmbedBlock,
    image: ImageBlock,
    accordion: AccordionBlock,
    carousel: CarouselBlock,
    heading: HeadingBlock,
    button: ButtonBlock,
    divider: DividerBlock,
    spacer: SpacerBlock,
    form: FormBlock,
    testimonial: TestimonialBlock,
    social: SocialBlock,
    map: MapBlock,
    progressbar: ProgressBarBlock,
    tabs: TabsBlock,
    toggle: ToggleBlock,
    gallery: GalleryBlock,
    counter: CounterBlock,
    lottie: LottieBlock,
    pricing: PricingBlock,
    flipbox: FlipBoxBlock,
    cta: CallToActionBlock,
    navmenu: NavMenuBlock,
    portfolio: PortfolioBlock,
    hotspots: HotspotsBlock,
    loopgrid: LoopGridBlock
};

const CONTAINER_TYPES = new Set(['grid', 'hero', 'bento', 'timeline', 'accordion', 'carousel', 'gallery', 'tabs', 'toggle']);

interface BlockNodeProps {
    block: any;
    allBlocks: any[];
    selectedBlockId: string | null;
    onSelect: (id: string) => void;
}

function BlockNode({ block, allBlocks, selectedBlockId, onSelect }: BlockNodeProps) {
    const Component = BlockComponents[block.type];
    if (!Component) return null;

    let parsedData: any = {};
    try { parsedData = JSON.parse(block.data); } catch { return null; }

    let parsedStyles: any = {};
    try { if (block.styles) parsedStyles = JSON.parse(block.styles); } catch { /* noop */ }

    const { imageUrl, videoUrl } = resolveBackgroundMediaUrls(parsedStyles);
    const styleObj = buildBlockInlineStyles(parsedStyles) as React.CSSProperties;
    const baseBackgroundStyle = buildFullBleedBackgroundStyle({
        color: parsedStyles.backgroundColor,
        imageUrl,
    }) as React.CSSProperties;
    const hasBaseBackground = Boolean((baseBackgroundStyle as any).backgroundColor || (baseBackgroundStyle as any).backgroundImage);
    const overlay = resolveBackgroundOverlay(parsedStyles);
    const hasCustomBackground = Boolean(
        hasBaseBackground ||
        videoUrl ||
        overlay.opacity > 0
    );

    const childrenBlocks = allBlocks
        .filter((b: any) => b.parentId === block.id)
        .sort((a: any, b: any) => a.order - b.order);

    const childrenNodes = childrenBlocks.map((child: any) => (
        <BlockNode key={child.id} block={child} allBlocks={allBlocks} selectedBlockId={selectedBlockId} onSelect={onSelect} />
    ));

    const isSelected = selectedBlockId === block.id;
    const isContainer = CONTAINER_TYPES.has(block.type);

    const outlineStyle = isSelected
        ? '2px solid #6366f1'                        // indigo ring when selected
        : isContainer
            ? undefined                              // no hover ring painted here; we use CSS group
            : undefined;

    const hoverClass = isContainer
        ? 'group/block hover:ring-2 hover:ring-blue-400 hover:ring-offset-0'
        : 'group/block hover:ring-2 hover:ring-dashed hover:ring-sky-400';

    return (
        <div
            className={`block-style-scope relative w-full transition-all duration-150 cursor-pointer ${hasCustomBackground ? 'block-has-background-media' : ''} ${hoverClass} ${block.isHidden ? 'opacity-45' : ''}`}
            style={{ ...styleObj, outline: outlineStyle }}
            data-block-id={block.id}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(block.id);
            }}
        >
            {hasBaseBackground && (
                <div
                    className="block-bg-fullbleed absolute inset-y-0 z-0 pointer-events-none"
                    style={baseBackgroundStyle}
                    aria-hidden="true"
                />
            )}
            <BlockBackgroundVideo url={videoUrl} fullBleed />
            {overlay.opacity > 0 && (
                <div
                    className="block-bg-fullbleed absolute inset-y-0 z-0 pointer-events-none"
                    style={{ backgroundColor: overlay.color, opacity: overlay.opacity }}
                    aria-hidden="true"
                />
            )}
            {/* Floating label on hover */}
            <div className={`absolute top-0 left-0 z-30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest pointer-events-none transition-opacity duration-150
                ${isSelected
                    ? 'opacity-100 bg-indigo-600 text-white'
                    : 'opacity-0 group-hover/block:opacity-100 bg-slate-900/80 text-white'
                }`}
            >
                {isContainer ? '📦' : '🔷'} {block.type}{block.isHidden ? ' · oculto' : ''}
            </div>

            <div className={`relative z-[1] ${hasCustomBackground ? 'block-force-transparent-root' : ''}`}>
                <Component data={parsedData} childrenNodes={childrenNodes} isEditor={true} />
            </div>
        </div>
    );
}

interface Props {
    blocks: any[];
    selectedBlockId: string | null;
    onSelect: (id: string) => void;
}

export default function ClientInlineBlockRenderer({ blocks, selectedBlockId, onSelect }: Props) {
    const rootBlocks = blocks
        .filter((b: any) => !b.parentId)
        .sort((a: any, b: any) => a.order - b.order);

    return (
        <div className="w-full relative">
            {rootBlocks.map((block: any) => (
                <BlockNode
                    key={block.id}
                    block={block}
                    allBlocks={blocks}
                    selectedBlockId={selectedBlockId}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

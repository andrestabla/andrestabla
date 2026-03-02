'use client';

import React from 'react';
import HeadingBlock from '@/components/HeadingBlock';
import HeroBlock from '@/components/HeroBlock';
import RichTextBlock from '@/components/RichTextBlock';
import TimelineBlock from '@/components/TimelineBlock';
import BentoGridBlock from '@/components/BentoGridBlock';
import GridBlock from '@/components/GridBlock';
import VideoBlock from '@/components/VideoBlock';
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

const BlockComponents: Record<string, any> = {
    hero: HeroBlock,
    richtext: RichTextBlock,
    timeline: TimelineBlock,
    bento: BentoGridBlock,
    grid: GridBlock,
    video: VideoBlock,
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

    const styleObj: React.CSSProperties = {};
    if (parsedStyles.backgroundColor) styleObj.backgroundColor = parsedStyles.backgroundColor;
    if (parsedStyles.backgroundImage) {
        styleObj.backgroundImage = `url('${parsedStyles.backgroundImage}')`;
        styleObj.backgroundSize = 'cover';
        styleObj.backgroundPosition = 'center';
    }
    if (parsedStyles.paddingTop) styleObj.paddingTop = `${parsedStyles.paddingTop}rem`;
    if (parsedStyles.paddingBottom) styleObj.paddingBottom = `${parsedStyles.paddingBottom}rem`;
    if (parsedStyles.padding) styleObj.padding = parsedStyles.padding;
    if (parsedStyles.margin) styleObj.margin = parsedStyles.margin;

    // New Styles
    if (parsedStyles.textColor) styleObj.color = parsedStyles.textColor;
    if (parsedStyles.fontSize) styleObj.fontSize = `${parsedStyles.fontSize}rem`;

    // Mapping font families to their CSS variables if needed, or just applying the string
    if (parsedStyles.fontFamily) {
        const fontMap: Record<string, string> = {
            'Inter': 'var(--font-inter)',
            'Roboto': 'var(--font-roboto)',
            'Playfair Display': 'var(--font-playfair)',
            'Outfit': 'var(--font-outfit)',
            'DM Sans': 'var(--font-dmsans)'
        };
        styleObj.fontFamily = fontMap[parsedStyles.fontFamily] || parsedStyles.fontFamily;
    }

    // Custom variable for headings within this block
    if (parsedStyles.titleColor) {
        (styleObj as any)['--heading'] = parsedStyles.titleColor;
        (styleObj as any)['--brand'] = parsedStyles.titleColor; // Optional: make brand color match title color in this block?
    }
    if (parsedStyles.textColor) {
        (styleObj as any)['--text'] = parsedStyles.textColor;
    }

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
            className={`relative w-full transition-all duration-150 cursor-pointer ${hoverClass}`}
            style={{ ...styleObj, outline: outlineStyle }}
            data-block-id={block.id}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(block.id);
            }}
        >
            {/* Floating label on hover */}
            <div className={`absolute top-0 left-0 z-30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest pointer-events-none transition-opacity duration-150
                ${isSelected
                    ? 'opacity-100 bg-indigo-600 text-white'
                    : 'opacity-0 group-hover/block:opacity-100 bg-slate-900/80 text-white'
                }`}
            >
                {isContainer ? '📦' : '🔷'} {block.type}
            </div>

            <Component data={parsedData} childrenNodes={childrenNodes} isEditor={true} />
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

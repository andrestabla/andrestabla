import { prisma } from '@/lib/prisma';
import HeroBlock from '@/components/HeroBlock';
import TimelineBlock from '@/components/TimelineBlock';
import BentoGridBlock from '@/components/BentoGridBlock';
import RichTextBlock from '@/components/RichTextBlock';
import GridBlock from '@/components/GridBlock';
import VideoBlock from '@/components/VideoBlock';
import EmbedBlock from '@/components/EmbedBlock';
import ImageBlock from '@/components/ImageBlock';
import AccordionBlock from '@/components/AccordionBlock';
import CarouselBlock from '@/components/CarouselBlock';
import HeadingBlock from '@/components/HeadingBlock';
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
import ClickToEditWrapper from '@/components/ClickToEditWrapper';
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

// Recursive Node Renderer
function BlockNode({ block, allBlocks, isEditor }: { block: any, allBlocks: any[], isEditor?: boolean }) {
    const Component = BlockComponents[block.type];
    if (!Component) return null;

    let parsedData = {};
    try {
        parsedData = JSON.parse(block.data);
    } catch (_error) {
        return <div className="p-4 border-l-4 border-red-500 bg-red-950/20 text-red-500 font-mono text-xs">Error: JSON Corrupto en bloque {block.type}</div>;
    }

    let parsedStyles: any = {};
    if (block.styles) {
        try {
            parsedStyles = JSON.parse(block.styles);
        } catch (_error) {
            // Handle error if styles JSON is corrupt
        }
    }

    const { imageUrl, videoUrl } = resolveBackgroundMediaUrls(parsedStyles);
    const styleString: any = buildBlockInlineStyles(parsedStyles);
    const baseBackgroundStyle = buildFullBleedBackgroundStyle({
        color: parsedStyles.backgroundColor,
        imageUrl,
    });
    const hasBaseBackground = Boolean(baseBackgroundStyle.backgroundColor || baseBackgroundStyle.backgroundImage);
    const overlay = resolveBackgroundOverlay(parsedStyles);
    const hasCustomBackground = Boolean(
        hasBaseBackground ||
        videoUrl ||
        overlay.opacity > 0
    );

    // Find children attached to this node
    const childrenBlocks = allBlocks
        .filter(b => b.parentId === block.id)
        .sort((a, b) => a.order - b.order);

    // If it has children, parse them recursively
    const childrenNodes = childrenBlocks.map((child: any) => (
        <BlockNode key={child.id} block={child} allBlocks={allBlocks} isEditor={isEditor} />
    ));

    const isContainer = ['grid', 'hero', 'bento', 'timeline', 'accordion', 'carousel', 'gallery', 'tabs', 'toggle'].includes(block.type);

    // Only show interactive editor borders in editor mode — the public site should have zero visual interference
    const editorOutlineClass = !isEditor ? '' : isContainer
        ? 'outline outline-[1.5px] outline-transparent hover:outline-blue-500 hover:bg-blue-500/5 cursor-pointer rounded-sm'
        : 'outline outline-[1.5px] outline-transparent hover:outline-dashed hover:outline-sky-400 hover:bg-sky-400/5 cursor-pointer rounded-sm';

    return (
        <div
            className={`group/block block-style-scope relative w-full transition-all duration-300 ${hasCustomBackground ? 'block-has-background-media' : ''} ${editorOutlineClass} ${isEditor ? 'admin-editor-node' : ''}`}
            style={styleString}
            data-block-id={block.id}
            id={`block-${block.id}`}
        >
            {hasBaseBackground && (
                <div
                    className="block-bg-fullbleed absolute inset-0 z-0 pointer-events-none"
                    style={baseBackgroundStyle}
                    aria-hidden="true"
                />
            )}
            <BlockBackgroundVideo url={videoUrl} fullBleed />
            {overlay.opacity > 0 && (
                <div
                    className="block-bg-fullbleed absolute inset-0 z-0 pointer-events-none"
                    style={{ backgroundColor: overlay.color, opacity: overlay.opacity }}
                    aria-hidden="true"
                />
            )}
            {isEditor && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-md rounded-tr-sm opacity-0 group-hover/block:opacity-100 transition-opacity z-50 pointer-events-none uppercase tracking-widest">
                    {block.type}
                </div>
            )}
            <div className={`relative z-[1] ${hasCustomBackground ? 'block-force-transparent-root' : ''}`}>
                <Component data={parsedData} childrenNodes={childrenNodes} isEditor={isEditor} />
            </div>
        </div>
    );
}

// Dispatcher Component: Fetches raw JSON blocks and injects them into the recursive tree
export default async function BlockRenderer({
    isEditor,
    pageSlug = 'home',
}: {
    isEditor?: boolean;
    pageSlug?: string;
}) {
    const page = await prisma.page.findUnique({
        where: { slug: pageSlug },
        include: { blocks: true },
    });

    if (!page) {
        return <div className="p-8 text-center text-slate-500">No se encontró la página solicitada en el CMS.</div>;
    }

    // Sort root blocks by order
    const rootBlocks = page.blocks
        .filter((b: any) => !b.parentId)
        .sort((a: any, b: any) => a.order - b.order);

    return (
        <div
            className="w-full relative admin-canvas-wrapper max-w-none md:max-w-[1200px] mx-auto px-0 md:px-12 pt-16 print:max-w-none print:px-0 print:pt-0"
            data-pdf-root="resume"
        >
            {isEditor && <ClickToEditWrapper />}
            {rootBlocks.map((block: any) => (
                <BlockNode key={block.id} block={block} allBlocks={page.blocks} isEditor={isEditor} />
            ))}
        </div>
    );
}

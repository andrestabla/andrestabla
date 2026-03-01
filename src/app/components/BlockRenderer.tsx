import { prisma } from '@/lib/prisma';
import HeroBlock from '@/components/HeroBlock';
import TimelineBlock from '@/components/TimelineBlock';
import BentoGridBlock from '@/components/BentoGridBlock';
import RichTextBlock from '@/components/RichTextBlock';
import GridBlock from '@/components/GridBlock';
import VideoBlock from '@/components/VideoBlock';
import ImageBlock from '@/components/ImageBlock';
import AccordionBlock from '@/components/AccordionBlock';
import CarouselBlock from '@/components/CarouselBlock';
import ClickToEditWrapper from '@/components/ClickToEditWrapper';

const BlockComponents: Record<string, any> = {
    hero: HeroBlock,
    richtext: RichTextBlock,
    timeline: TimelineBlock,
    bento: BentoGridBlock,
    grid: GridBlock,
    video: VideoBlock,
    image: ImageBlock,
    accordion: AccordionBlock,
    carousel: CarouselBlock
};

// Recursive Node Renderer
function BlockNode({ block, allBlocks }: { block: any, allBlocks: any[] }) {
    const Component = BlockComponents[block.type];
    if (!Component) return null;

    let parsedData = {};
    try {
        parsedData = JSON.parse(block.data);
    } catch (e) {
        return <div className="p-4 border-l-4 border-red-500 bg-red-950/20 text-red-500 font-mono text-xs">Error: JSON Corrupto en bloque {block.type}</div>;
    }

    let parsedStyles: any = {};
    if (block.styles) {
        try {
            parsedStyles = JSON.parse(block.styles);
        } catch (e) {
            // Handle error if styles JSON is corrupt
        }
    }

    // Apply parsed styles dynamically
    const styleString: any = {};
    if (parsedStyles.backgroundColor) styleString.backgroundColor = parsedStyles.backgroundColor;
    if (parsedStyles.backgroundImage) {
        styleString.backgroundImage = `url('${parsedStyles.backgroundImage}')`;
        styleString.backgroundSize = 'cover';
        styleString.backgroundPosition = 'center';
    }
    if (parsedStyles.paddingTop) styleString.paddingTop = `${parsedStyles.paddingTop}rem`;
    if (parsedStyles.paddingBottom) styleString.paddingBottom = `${parsedStyles.paddingBottom}rem`;
    if (parsedStyles.padding) styleString.padding = parsedStyles.padding;
    if (parsedStyles.margin) styleString.margin = parsedStyles.margin;

    // Find children attached to this node
    const childrenBlocks = allBlocks
        .filter(b => b.parentId === block.id)
        .sort((a, b) => a.order - b.order);

    return (
        <div
            className="group/block relative w-full h-full transition-all duration-300 outline outline-1 outline-transparent hover:outline-indigo-500 hover:ring-2 hover:ring-indigo-500/20 cursor-pointer rounded-sm"
            style={styleString}
            data-block-id={block.id}
            id={`block-${block.id}`}
        >
            <Component data={parsedData} childrenBlocks={childrenBlocks} allBlocks={allBlocks} />
        </div>
    );
}

// Dispatcher Component: Fetches raw JSON blocks and injects them into the recursive tree
export default async function BlockRenderer() {
    const page = await prisma.page.findFirst({
        where: { slug: 'home' },
        include: { blocks: true },
    });

    if (!page) {
        return <div className="p-8 text-center text-slate-500">No home page found. Please configure the CMS.</div>;
    }

    // Sort root blocks by order
    const rootBlocks = page.blocks
        .filter((b: any) => !b.parentId)
        .sort((a: any, b: any) => a.order - b.order);

    return (
        <div className="w-full relative admin-canvas-wrapper">
            <ClickToEditWrapper />
            {rootBlocks.map((block: any) => (
                <BlockNode key={block.id} block={block} allBlocks={page.blocks} />
            ))}
        </div>
    );
}

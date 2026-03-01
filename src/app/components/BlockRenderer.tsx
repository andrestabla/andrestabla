import { prisma } from '@/lib/prisma';
import HeroBlock from '@/components/HeroBlock';
import TimelineBlock from '@/components/TimelineBlock';
import BentoGridBlock from '@/components/BentoGridBlock';
import RichTextBlock from '@/components/RichTextBlock';
import GridBlock from '@/components/GridBlock';

const BlockComponents: Record<string, any> = {
    hero: HeroBlock,
    richtext: RichTextBlock,
    timeline: TimelineBlock,
    bento: BentoGridBlock,
    grid: GridBlock
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

    let customStyles: React.CSSProperties = {};
    if (block.styles) {
        try {
            const stylesObj = JSON.parse(block.styles);
            if (stylesObj.backgroundColor) customStyles.backgroundColor = stylesObj.backgroundColor;
            if (stylesObj.backgroundImage) {
                customStyles.backgroundImage = `url('${stylesObj.backgroundImage}')`;
                customStyles.backgroundSize = 'cover';
                customStyles.backgroundPosition = 'center';
            }
            if (stylesObj.paddingTop) customStyles.paddingTop = `${stylesObj.paddingTop}rem`;
            if (stylesObj.paddingBottom) customStyles.paddingBottom = `${stylesObj.paddingBottom}rem`;
        } catch (e) { }
    }

    // Find children attached to this node
    const childrenBlocks = allBlocks
        .filter(b => b.parentId === block.id)
        .sort((a, b) => a.order - b.order);

    // If it has children, parse them recursively
    const childrenNodes = childrenBlocks.map(child => (
        <BlockNode key={child.id} block={child} allBlocks={allBlocks} />
    ));

    return (
        <div
            className={`w-full relative fade-in-section node-type-${block.type}`}
            style={customStyles}
        >
            <Component data={parsedData} childrenNodes={childrenNodes} />
        </div>
    );
}

// Dispatcher Component: Fetches raw JSON blocks and injects them into the recursive tree
export default async function BlockRenderer() {

    // 1. Fetch all raw configurations from DB
    const pages = await prisma.page.findMany({
        where: { slug: 'home' },
        include: {
            blocks: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!pages || pages.length === 0) return <div className="p-24 text-center text-slate-500">No hay contenido publicado. Usa el Panel de Control para añadir bloques.</div>;

    const allBlocks = pages[0].blocks;
    const rootBlocks = allBlocks.filter((b: any) => !b.parentId).sort((a: any, b: any) => a.order - b.order);

    // 2. Render Root Loop
    return (
        <main className="w-full flex flex-col gap-0 max-w-[1200px] mx-auto px-6 md:px-12 pt-16">
            {rootBlocks.map((rootBlock: any) => (
                <BlockNode key={rootBlock.id} block={rootBlock} allBlocks={allBlocks} />
            ))}
        </main>
    );
}

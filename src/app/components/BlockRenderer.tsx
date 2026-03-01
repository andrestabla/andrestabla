import { prisma } from '@/lib/prisma';
import HeroBlock from '@/components/HeroBlock';
import TimelineBlock from '@/components/TimelineBlock';
import BentoGridBlock from '@/components/BentoGridBlock';
import RichTextBlock from '@/components/RichTextBlock';

const BlockComponents: Record<string, any> = {
    hero: HeroBlock,
    richtext: RichTextBlock,
    timeline: TimelineBlock,
    bento: BentoGridBlock,
};

// Dispatcher Component: Receives raw JSON blocks and injects them into specific React Components
export default async function BlockRenderer() {

    // 1. Fetch all raw configurations from DB sorted by 'order'
    const pages = await prisma.page.findMany({
        where: { slug: 'home' },
        include: {
            blocks: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!pages || pages.length === 0) return <div className="p-24 text-center text-slate-500">No hay contenido publicado. Usa el Panel de Control para añadir bloques.</div>;

    const blocks = pages[0].blocks;

    // 2. Render Loop
    return (
        <main className="w-full flex flex-col gap-0 max-w-[1200px] mx-auto px-6 md:px-12 pt-16">
            {blocks.map((block: any) => {
                const Component = BlockComponents[block.type];
                if (!Component) return null; // Unknown block type

                let parsedData = {};
                try {
                    parsedData = JSON.parse(block.data);
                } catch (e) {
                    return <div key={block.id} className="p-4 border-l-4 border-red-500 bg-red-950/20 text-red-500 font-mono text-xs">Error: JSON Corrupto en bloque {block.type}</div>;
                }

                return (
                    <div key={block.id} className="w-full relative fade-in-section">
                        <Component data={parsedData} />
                    </div>
                );
            })}
        </main>
    );
}

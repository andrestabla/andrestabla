import HeroBlock from './HeroBlock';
import TimelineBlock from './TimelineBlock';
import RichTextBlock from './RichTextBlock';
import BentoGridBlock from './BentoGridBlock';

export default function BlockRenderer({ block }: { block: any }) {

    let parsedData = {};
    try {
        parsedData = JSON.parse(block.data);
    } catch (e) {
        console.error("Error parsing block data", e);
    }

    switch (block.type) {
        case 'hero':
            return <HeroBlock data={parsedData} />;
        case 'richtext':
            return <RichTextBlock data={parsedData} />;
        case 'timeline':
            return <TimelineBlock data={parsedData} />;
        case 'bento':
            return <BentoGridBlock data={parsedData} />;
        default:
            return (
                <div className="p-4 border border-red-500 bg-red-50 text-red-600 rounded-lg text-sm">
                    Bloque desconocido: {block.type}
                </div>
            );
    }
}

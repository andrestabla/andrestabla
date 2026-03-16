import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import { buildResumePdfFilename, ResumePdfDocument } from '@/lib/resumePdf';
import { stripHtml } from '@/lib/seo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    const page = await prisma.page.findUnique({
        where: { slug: 'home' },
        include: { blocks: true },
    });

    if (!page) {
        return new Response('No se encontró la hoja de vida.', { status: 404 });
    }

    const rootBlocks = page.blocks
        .filter((block: any) => !block.parentId)
        .sort((a: any, b: any) => a.order - b.order);
    const heroBlock = rootBlocks.find((block: any) => block.type === 'hero');
    let fullName = 'andres-tabla-rico';

    if (heroBlock?.data) {
        try {
            fullName = stripHtml(JSON.parse(heroBlock.data || '{}')?.name || fullName) || fullName;
        } catch {
            // Ignore malformed hero JSON and use fallback filename.
        }
    }

    const pdfBuffer = await renderToBuffer(<ResumePdfDocument blocks={rootBlocks} />);

    return new Response(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${buildResumePdfFilename(fullName)}"`,
            'Cache-Control': 'no-store',
        },
    });
}

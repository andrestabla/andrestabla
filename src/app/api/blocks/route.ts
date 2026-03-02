import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const pageId = request.nextUrl.searchParams.get('pageId');
    if (!pageId) return NextResponse.json({ error: 'Missing pageId' }, { status: 400 });

    const blocks = await prisma.block.findMany({
        where: { pageId },
        orderBy: { order: 'asc' }
    });

    return NextResponse.json(blocks, {
        headers: { 'Cache-Control': 'no-store' }
    });
}

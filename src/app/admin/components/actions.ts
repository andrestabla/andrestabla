'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Update a single block's JSON data
export async function updateBlockData(id: string, newData: string) {
    await prisma.block.update({
        where: { id },
        data: { data: newData }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

// Add a new block to the end of the page
export async function addBlock(pageId: string, type: string, defaultData: any) {
    const count = await prisma.block.count({ where: { pageId } });

    await prisma.block.create({
        data: {
            pageId,
            type,
            data: JSON.stringify(defaultData),
            order: count + 1
        }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

// Delete a block
export async function deleteBlock(id: string) {
    await prisma.block.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
}

// Reorder blocks (drag and drop support)
export async function reorderBlocks(pageId: string, blockIds: string[]) {
    // blockIds is an array of IDs in the new correct order
    const updatePromises = blockIds.map((id, index) =>
        prisma.block.update({
            where: { id },
            data: { order: index }
        })
    );

    await prisma.$transaction(updatePromises);
    revalidatePath('/');
    revalidatePath('/admin');
}

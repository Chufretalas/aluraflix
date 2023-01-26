import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient, type aluraflix_videos } from '@prisma/client';

const prisma = new PrismaClient()

// ======================================================================= //

export const GET = (async ({ url }) => {
    try {
        let response = await prisma.aluraflix_videos.findMany({
            take: 25
        })
        prisma.$disconnect()
        return new Response(JSON.stringify(response))
    } catch (err) {
        prisma.$disconnect()
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler;
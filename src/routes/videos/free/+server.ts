import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/server/client';

// ======================================================================= //

export const GET = (async ({ url }) => {
    try {
        let response = await prisma.aluraflix_videos.findMany({
            take: 25
        })
        return new Response(JSON.stringify(response))
    } catch (err) {
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler;
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const GET = (async ({ url }) => {
    let allVideos = await prisma.aluraflix_videos.findMany()
    return new Response(JSON.stringify(allVideos))
}) satisfies RequestHandler;
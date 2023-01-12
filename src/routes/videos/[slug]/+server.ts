import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const GET = (async ({ url, params }) => {
    let response
    try {
        response = await prisma.aluraflix_videos.findFirstOrThrow({ where: { id: +params.slug } })
    } catch (error) {
        response = { error: `Nenhum vídeo com id ${params.slug} foi encontrado.` }
    }
    prisma.$disconnect()
    return new Response(JSON.stringify(response))
}) satisfies RequestHandler;
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const GET = (async ({ url, params }) => {
    if(params.slug === "undefined") {
        return new Response(JSON.stringify({
            error: "Choose a number id in the url /videos/<id> | Or input a number in the input of the index page."
        }))
    }
    let response
    try {
        response = await prisma.aluraflix_videos.findFirstOrThrow({ where: { id: +params.slug } })
    } catch (error) {
        response = { error: `Nenhum vídeo com id ${params.slug} foi encontrado.` }
    }
    prisma.$disconnect()
    return new Response(JSON.stringify(response))
}) satisfies RequestHandler;
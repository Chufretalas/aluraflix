import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const GET = (async ({ params }) => {
    if (isNaN(+params.slug) || !(Number.isInteger(+params.slug))) {
        prisma.$disconnect()
        throw error(400, "video id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.aluraflix_videos.findFirstOrThrow({ where: { id: +params.slug } })
        prisma.$disconnect()
        return new Response(JSON.stringify(response))

    } catch (er: any) {
        prisma.$disconnect()
        if (er.message.includes("found")) throw error(400, `video com id: ${params.slug} não existe`)
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;

// ======================================================================= //

export const DELETE = (async ({ params }) => {
    if (isNaN(+params.slug) || !(Number.isInteger(+params.slug))) {
        prisma.$disconnect()
        throw error(400, "video id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.aluraflix_videos.delete({
            where: {
                id: +params.slug
            }
        })
        prisma.$disconnect()

        return new Response(JSON.stringify({
            deletedVideo: response
        }))

    } catch (er: any) {
        prisma.$disconnect()
        if (er.message.includes("Record to delete does not exist")) throw error(400, `video com id: ${params.slug} não existe`)
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;
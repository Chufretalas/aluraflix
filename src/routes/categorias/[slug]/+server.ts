import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { PrismaClient } from '@prisma/client';
import getJson from '$lib/server/api_helpers/getJson';

const prisma = new PrismaClient()

export const GET = (async ({ params }) => {
    if (isNaN(+params.slug) || !(Number.isInteger(+params.slug))) {
        prisma.$disconnect()
        throw error(400, "categoria id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.categorias.findFirstOrThrow({ where: { id: +params.slug } })
        prisma.$disconnect()
        return new Response(JSON.stringify(response))

    } catch (er: any) {
        prisma.$disconnect()
        if (er.message.includes("found")) throw error(400, `video com id: ${params.slug} não existe`)
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;
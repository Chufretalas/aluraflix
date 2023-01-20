import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { PrismaClient } from '@prisma/client';
import getJson from '$lib/server/api_helpers/getJson';
import validateColor from '$lib/server/api_helpers/validate_color';

const prisma = new PrismaClient()

export const GET = (async ({ params }) => {

    if (isNaN(+params.slug) || !(Number.isInteger(+params.slug))) {
        prisma.$disconnect()
        throw error(400, "categoria id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.aluraflix_videos.findMany({ where: { categoria_id: +params.slug } })
        if (response.length === 0) {
            const respCategorias = await prisma.categorias.findFirst({ where: { id: +params.slug } })
            if (!respCategorias) {
                prisma.$disconnect()
                throw error(400, `o id de catgoria: ${+params.slug}, não existe`)
            }
        }
        prisma.$disconnect()
        return new Response(JSON.stringify(response))

    } catch (er: any) {
        prisma.$disconnect()
        if(er.status == 400) throw er
        if (er.message.includes("found")) throw error(400, `video com id: ${params.slug} não existe`)
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;
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
        const response = await prisma.categorias.findFirstOrThrow({ where: { id: +params.slug } })
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
        throw error(400, "categoria id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.categorias.delete({
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
        if (er.message.includes("Record to delete does not exist")) throw error(400, `categoria com id: ${params.slug} não existe`)
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;

// ======================================================================= //

async function PUTPATCHHandler(request: Request, params: any) {
    if (isNaN(+params.slug) || !(Number.isInteger(+params.slug))) {
        prisma.$disconnect()
        throw error(400, "categoria id deve ser um numero inteiro")
    }

    const { data, success } = await getJson(request)

    if (!success) throw error(400, "body inválido")

    let finalData = {}

    if (data.titulo) {
        if (data.titulo.length > 30) throw error(400, "titulo longo demais, máximo de 30 caracteres")
        finalData = {
            titulo: data.titulo.toUpperCase()
        }
    }

    if (data.cor) {
        if (!(validateColor(data.cor))) throw error(400, "cor deve estar no formato hexadecimal, exemplo: 1cd0d6")
        finalData = {
            ...finalData,
            cor: data.cor
        }
    }

    try {
        const response = await prisma.categorias.update({
            where: {
                id: +params.slug
            },
            data: finalData
        })
        prisma.$disconnect()
        return new Response(JSON.stringify({ updatedCategoria: response }))

    } catch (er: any) {
        prisma.$disconnect()
        if (er.message.includes("Record to update not found")) throw error(400, `categoria com id: ${params.slug} não existe`)
        throw error(500, "unkown error")
    }
}

export const PUT = (async ({ request, params }) => {
    return await PUTPATCHHandler(request, params)
}) satisfies RequestHandler;

export const PATCH = (async ({ request, params }) => {
    return await PUTPATCHHandler(request, params)
}) satisfies RequestHandler;
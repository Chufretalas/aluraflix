import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';
import getJson from '$lib/server/api_helpers/getJson';
import authenticate from '$lib/server/api_helpers/authenticate';

const prisma = new PrismaClient()

export const GET = (async ({ params, request }) => {
    authenticate(request.headers)
    if (isNaN(+params.id) || !(Number.isInteger(+params.id))) {
        prisma.$disconnect()
        throw error(400, "video id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.aluraflix_videos.findFirstOrThrow({ where: { id: +params.id } })
        prisma.$disconnect()
        return new Response(JSON.stringify(response))

    } catch (er: any) {
        prisma.$disconnect()
        if (er.message.includes("found")) throw error(400, `video com id: ${params.id} não existe`)
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;

// ======================================================================= //

export const DELETE = (async ({ params, request }) => {
    authenticate(request.headers)
    if (isNaN(+params.id) || !(Number.isInteger(+params.id))) {
        prisma.$disconnect()
        throw error(400, "video id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.aluraflix_videos.delete({
            where: {
                id: +params.id
            }
        })
        prisma.$disconnect()
        
        return new Response(JSON.stringify({
            deletedVideo: response
        }))
        
    } catch (er: any) {
        prisma.$disconnect()
        if (er.message.includes("Record to delete does not exist")) throw error(400, `video com id: ${params.id} não existe`)
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;

// ======================================================================= //

async function PUTPATCHHandler(request: Request, params: any) {
    authenticate(request.headers)
    if (isNaN(+params.id) || !(Number.isInteger(+params.id))) {
        prisma.$disconnect()
        throw error(400, "video id deve ser um numero inteiro")
    }

    const { data, success } = await getJson(request)

    if (!success) throw error(400, "body inválido")

    let finalData = {}

    if (data.titulo) {
        if (data.titulo.length > 40) throw error(400, "titulo longo demais, máximo de 40 caracteres")
        finalData = {
            titulo: data.titulo
        }
    }

    if (data.descricao) {
        finalData = {
            ...finalData,
            descricao: data.descricao
        }
    }

    if (data.url) {
        if (data.url.length > 100) throw error(400, "url longa demais, máximo de 100 caracteres")
        finalData = {
            ...finalData,
            url: data.url
        }
    }

    try {
        const response = await prisma.aluraflix_videos.update({
            where: {
                id: +params.id
            },
            data: finalData
        })
        prisma.$disconnect()
        return new Response(JSON.stringify({ updatedVideo: response }))

    } catch (er: any) {
        prisma.$disconnect()
        if (er.message.includes("Record to update not found")) throw error(400, `video com id: ${params.id} não existe`)
        throw error(500, "unkown error")
    }
}

export const PUT = (async ({ request, params }) => {
    return await PUTPATCHHandler(request, params)
}) satisfies RequestHandler;

export const PATCH = (async ({ request, params }) => {
    return await PUTPATCHHandler(request, params)
}) satisfies RequestHandler;
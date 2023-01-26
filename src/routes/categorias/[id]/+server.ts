import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import getJson from '$lib/server/api_helpers/getJson';
import validateColor from '$lib/server/api_helpers/validate_color';
import authenticate from '$lib/server/api_helpers/authenticate';
import prisma from '$lib/server/client';


export const GET = (async ({ params, request }) => {
    authenticate(request.headers)
    if (isNaN(+params.id) || !(Number.isInteger(+params.id))) {
        throw error(400, "categoria id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.categorias.findFirstOrThrow({ where: { id: +params.id } })
        return new Response(JSON.stringify(response))

    } catch (er: any) {
        if (er.message.includes("found")) throw error(400, `video com id: ${params.id} não existe`)
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler;

// ======================================================================= //

export const DELETE = (async ({ params, request }) => {
    authenticate(request.headers)
    if (isNaN(+params.id) || !(Number.isInteger(+params.id))) {
        throw error(400, "categoria id deve ser um numero inteiro")
    }
    if (+params.id === 1) {
        throw error(400, "não é permitido deletar a categoria LIVRE")
    }

    try {
        const response = await prisma.categorias.delete({
            where: {
                id: +params.id
            }
        })

        return new Response(JSON.stringify({
            deletedVideo: response
        }))

    } catch (er: any) {
        if (er.message.includes("Record to delete does not exist")) throw error(400, `categoria com id: ${params.id} não existe`)
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler;

// ======================================================================= //

async function PUTPATCHHandler(request: Request, params: any) {
    authenticate(request.headers)
    if (isNaN(+params.id) || !(Number.isInteger(+params.id))) {
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
                id: +params.id
            },
            data: finalData
        })
        return new Response(JSON.stringify({ updatedCategoria: response }))

    } catch (er: any) {
        if (er.message.includes("Record to update not found")) throw error(400, `categoria com id: ${params.id} não existe`)
        throw error(500, "unknown error")
    }
}

export const PUT = (async ({ request, params }) => {
    return await PUTPATCHHandler(request, params)
}) satisfies RequestHandler;

export const PATCH = (async ({ request, params }) => {
    return await PUTPATCHHandler(request, params)
}) satisfies RequestHandler;
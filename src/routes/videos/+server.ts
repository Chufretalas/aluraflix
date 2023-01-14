import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient, type aluraflix_videos } from '@prisma/client';
import type IPostVideo from '$lib/interfaces/IPostVideos';

async function getJson(request: Request) {
    try {
        return { data: await request.json(), success: true }
    } catch (error) {
        return { data: {}, success: false }
    }
}

async function createEntry(titulo: string, descricao: string): Promise<aluraflix_videos> {
    const dbCreateResponse = await prisma.aluraflix_videos.create({
        data: {
            titulo: titulo,
            descricao: descricao,
            url: "http://localhost:5173/videos/"
        }
    })
    const dbUpdateResponse = await prisma.aluraflix_videos.update({
        where: {
            id: dbCreateResponse.id
        },
        data: {
            url: dbCreateResponse.url + dbCreateResponse.id
        }
    })
    return dbUpdateResponse
}

const prisma = new PrismaClient()


export const GET = (async ({ url }) => {
    let allVideos = await prisma.aluraflix_videos.findMany()
    prisma.$disconnect()
    return new Response(JSON.stringify(allVideos))
}) satisfies RequestHandler;


export const POST = (async ({ request }) => {
    try {
        const requestData: IPostVideo = await request.json()

        if ("titulo" in requestData && "descricao" in requestData) {

            if (!requestData.titulo) throw new Error("titulo não pode ser vazio")
            else if (requestData.titulo.length > 40) throw new Error("titulo não pode ter mais que 40 caracteres")
            else if (!requestData.descricao) throw new Error("descrição não pode ser vazia")

            const dbResponse = await createEntry(requestData.titulo, requestData.descricao)
            prisma.$disconnect()

            return new Response(JSON.stringify(dbResponse))
        }

        throw new Error("incomplete body input")

    } catch (err: any) {
        throw error(400, "Erro no POST: " + err.message)
    }
}) satisfies RequestHandler

// ==================================================
async function PUTPATCHHandler(request: Request) {
    const { data, success } = await getJson(request)

    if (!success) throw error(400, "body inválido")

    if (!("id" in data)) throw error(400, "campo 'id' obrigatório")

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
                id: data.id
            },
            data: finalData
        })

        return new Response(JSON.stringify({ success: true, updatedVideo: response }))

    } catch (er: any) {
        if (er.message.includes("Record to update not found")) throw error(400, "video não encontrado na base de dados")
        throw error(500, "unkown error")
    }

}

export const PUT = (async ({ request }) => {
    return await PUTPATCHHandler(request)
}) satisfies RequestHandler;

export const PATCH = (async ({ request }) => {
    return await PUTPATCHHandler(request)
}) satisfies RequestHandler;
// ==================================================

prisma.$disconnect()
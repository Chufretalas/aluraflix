import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient, type aluraflix_videos } from '@prisma/client';

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
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (!("titulo" in data && "descricao" in data)) throw error(400, "campos 'titulo e descricao são obrigatórios")
        if (!data.titulo || data.titulo.length > 40) throw error(400, "titulo não pode ser vazio e tem limite de 40 caracteres")
        if (!data.descricao) throw error(400, "descrição não pode ser vazia")

        const dbResponse = await createEntry(data.titulo, data.descricao)
        prisma.$disconnect()

        return new Response(JSON.stringify({ newVideo: dbResponse }))

    } 
    catch (err: any) {
        prisma.$disconnect()
        if(err.status == 400) throw err
        throw error(500, "unkown error")
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
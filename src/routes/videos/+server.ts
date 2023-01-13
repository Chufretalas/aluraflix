import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient, type aluraflix_videos } from '@prisma/client';
import type IPostVideo from '$lib/interfaces/IPostVideos';

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

        if (requestData.titulo !== undefined && requestData.descricao !== undefined) {

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

prisma.$disconnect()
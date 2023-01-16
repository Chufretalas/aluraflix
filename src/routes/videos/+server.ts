import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient, type aluraflix_videos } from '@prisma/client';
import getJson from '$lib/server/api_helpers/getJson';

async function createEntry(id: number | null, titulo: string, descricao: string): Promise<aluraflix_videos> {
    if (id) {
        try {
            const dbResponse = await prisma.aluraflix_videos.create({
                data: {
                    id: id,
                    titulo: titulo,
                    descricao: descricao,
                    url: `http://localhost:5173/videos/${id}`
                }
            })
            return dbResponse
        } catch (err: any) {
            if (err.message.includes("Unique constraint failed on the fields: (`id`)")) {
                throw error(400, `video com id ${id}, já existe`)
            }
            throw error(500, "unkown error")
        }
    }

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
    try {
        let allVideos = await prisma.aluraflix_videos.findMany({
            orderBy: [{ id: "asc" }]
        })
        prisma.$disconnect()
        return new Response(JSON.stringify(allVideos))
    } catch (er) {
        prisma.$disconnect()
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;

// ======================================================================= //

export const POST = (async ({ request }) => {
    try {
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (data.id) {
            if (isNaN(+data.id) || !(Number.isInteger(+data.id))) throw error(400, "valor opcional 'id' deve ser um número inteiro")
        }
        if (!("titulo" in data && "descricao" in data)) throw error(400, "campos 'titulo e descricao são obrigatórios")
        if (!data.titulo || data.titulo.length > 40) throw error(400, "titulo não pode ser vazio e tem limite de 40 caracteres")
        if (!data.descricao) throw error(400, "descrição não pode ser vazia")

        const dbResponse = await createEntry(data.id ?? null, data.titulo, data.descricao)
        prisma.$disconnect()

        return new Response(JSON.stringify({ newVideo: dbResponse }))

    }
    catch (err: any) {
        prisma.$disconnect()
        if (err.status == 400) throw err
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler

prisma.$disconnect()
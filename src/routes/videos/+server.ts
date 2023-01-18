import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient, type aluraflix_videos } from '@prisma/client';
import getJson from '$lib/server/api_helpers/getJson';

async function createEntry(id: number | undefined, titulo: string, descricao: string, categoria_id: number = 1): Promise<aluraflix_videos> {
    try {
        const dbResponse = await prisma.aluraflix_videos.create({
            data: {
                id: id,
                titulo: titulo,
                descricao: descricao,
                url: `http://localhost:5173/videos/${id}`,
                categoria_id: categoria_id
            }
        })
        return dbResponse
    } catch (err: any) {
        if (err.message.includes("Unique constraint failed on the fields: (`id`)")) {
            if (id === undefined) { // fixes a problem when an id that is higher than the autoincremenet is manually put in
                try {
                    return await createEntry(id, titulo, descricao, categoria_id)
                } catch (err2) {
                    throw error(500, "unkown error")
                }
            }
            throw error(400, `video com id: ${id}, já existe`)
        }
        if (err.message.includes("Foreign key constraint failed on the field: `aluraflix_videos_categoria_id_fkey (index)`")) {
            throw error(400, `categoria_id: ${categoria_id} não é válido`)
        }
        throw error(500, "unkown error")
    }
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
        if (data.categoria_id && (isNaN(+data.categoria_id) || !Number.isInteger(+data.categoria_id))) throw error(400, "categoria_id deve ser um numero inteiro")

        const dbResponse = await createEntry(data.id, data.titulo, data.descricao, data.categoria_id)
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
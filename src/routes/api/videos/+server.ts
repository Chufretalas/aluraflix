import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import getJson from '$lib/server/api_helpers/getJson';
import paginate from '$lib/server/api_helpers/paginate';
import authenticate from '$lib/server/api_helpers/authenticate';
import prisma from '$lib/server/client';
import type { aluraflix_videos } from '@prisma/client';

// ======================================================================= //

export const GET = (async ({ url, request }) => {
    authenticate(request.headers)
    const search = url.searchParams.get("search")
    const page = url.searchParams.get("page")
    let videos
    if (search) {
        try {
            let response = await prisma.aluraflix_videos.findMany({
                where: {
                    titulo: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            })
            videos = response
        } catch (err) {
            throw error(400, "unknown error")
        }
    } else {
        try {
            let allVideos = await prisma.aluraflix_videos.findMany({
                orderBy: [{ id: "asc" }]
            })
            videos = allVideos
        } catch (er) {
            throw error(500, "unknown error")
        }
    }

    if (page && videos.length !== 0) {
        if (isNaN(+page) || !(Number.isInteger(+page))) throw error(400, "page deve ser um valor inteiro")

        const finalVideos = paginate(videos);

        let response = finalVideos.get(page)
        if (!response) throw error(400, `page inválido, as pages só vão até ${finalVideos.size}`)
        return new Response(JSON.stringify(response))
    }

    return new Response(JSON.stringify(videos))
}) satisfies RequestHandler;

// ======================================================================= //

async function createEntry(
    id: number | undefined,
    titulo: string,
    descricao: string,
    url: string,
    categoria_id: number = 1,
    author: string): Promise<aluraflix_videos> {

    try {
        const dbResponse = await prisma.aluraflix_videos.create({
            data: {
                id: id,
                titulo: titulo,
                descricao: descricao,
                url: url,
                categoria_id: categoria_id,
                author
            }
        })
        return dbResponse
    } catch (err: any) {
        if (err.message.includes("Unique constraint failed on the fields: (`id`)")) {
            if (id === undefined) { // fixes a problem when an id that is higher than the autoincremenet is manually put in
                try {
                    return await createEntry(id, titulo, descricao, url, categoria_id, author)
                } catch (err2) {
                    throw error(500, "unknown error")
                }
            }
            throw error(400, `video com id: ${id}, já existe`)
        }
        if (err.message.includes("Foreign key constraint failed on the field: `aluraflix_videos_categoria_id_fkey (index)`")) {
            throw error(400, `categoria_id: ${categoria_id} não é válido`)
        }
        throw error(500, "unknown error")
    }
}

// ======================================================================= //

export const POST = (async ({ request }) => {
    const author = authenticate(request.headers)
    try {
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (data.id) {
            if (isNaN(+data.id) || !(Number.isInteger(+data.id))) throw error(400, "valor opcional 'id' deve ser um número inteiro")
        }
        if (!("titulo" in data && "descricao" in data)) throw error(400, "campos 'titulo e descricao são obrigatórios")
        if (!data.titulo || data.titulo.length > 40) throw error(400, "titulo não pode ser vazio e tem limite de 40 caracteres")
        if (!data.descricao) throw error(400, "descrição não pode ser vazia")
        if (data.categoria_id && (isNaN(+data.categoria_id) || !Number.isInteger(+data.categoria_id))) {
            throw error(400, "categoria_id deve ser um numero inteiro")
        }
        if (!data.url) throw error(400, "url não pode ser vazia")
        if (data.url.length > 100) throw error(400, "url tem limite de 100 caracteres")

        const dbResponse = await createEntry(data.id, data.titulo, data.descricao, data.url, data.categoria_id, author)

        return new Response(JSON.stringify({ newVideo: dbResponse }), { status: 201 })

    }
    catch (err: any) {
        if (err.status == 400) throw err
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler
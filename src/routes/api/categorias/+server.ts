import authenticate from "$lib/server/api_helpers/authenticate";
import getJson from "$lib/server/api_helpers/getJson";
import paginate from "$lib/server/api_helpers/paginate";
import validateColor from "$lib/server/api_helpers/validate_color";
import prisma from "$lib/server/client";
import type { categorias } from "@prisma/client";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "../videos/$types";

export const GET = (async ({ url, request }) => {
    authenticate(request.headers)
    const page = url.searchParams.get("page")
    try {
        let allCategories = await prisma.categorias.findMany({
            orderBy: [{ id: "asc" }]
        })
        if (page && allCategories.length !== 0) {
            if (isNaN(+page) || !(Number.isInteger(+page))) throw error(400, "page deve ser um valor inteiro")
            const finalCategories = paginate(allCategories);

            let response = finalCategories.get(page)
            if (!response) throw error(400, `page inválido, as pages só vão até ${finalCategories.size}`)
            return new Response(JSON.stringify(response))
        }
        return new Response(JSON.stringify(allCategories))
    } catch (er: any) {
        if (er.status === 400) throw er
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler;


// ======================================================================= //

async function createEntry(id: number | undefined, titulo: string, cor: string, author: string): Promise<categorias> {
    try {
        const dbResponse = await prisma.categorias.create({
            data: {
                id: id,
                titulo: titulo.toUpperCase(),
                cor: cor.toUpperCase(),
                author
            }
        })
        return dbResponse
    } catch (err: any) {
        if (err.message.includes("Unique constraint failed on the fields: (`id`)")) {
            if (id === undefined) {
                try {
                    return await createEntry(id, titulo, cor, author)
                } catch (err2) {
                    throw error(500, "unknown error")
                }
            }
            throw error(400, `categoria com id: ${id}, já existe`)
        }
        if (err.message.includes("Unique constraint failed on the fields: (`titulo`)")) {
            throw error(400, `titulo: '${titulo.toUpperCase()}' já existe`)
        }
        throw error(500, "unknown error")
    }
}

// =========================== //

export const POST = (async ({ request }) => {
    const author = authenticate(request.headers)
    try {
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (data.id) {
            if (isNaN(+data.id) || !(Number.isInteger(+data.id))) throw error(400, "valor opcional 'id' deve ser um número inteiro")
        }
        if (!("titulo" in data && "cor" in data)) throw error(400, "campos 'titulo e cor são obrigatórios")
        if (!data.titulo || data.titulo.length > 30) throw error(400, "titulo não pode ser vazio e tem limite de 30 caracteres")
        if (!data.cor) throw error(400, "cor não pode ser vazia")
        if (!validateColor(data.cor)) throw error(400, "cor deve estar no formato hexadecimal, exemplo: 1cd0d6")
        const dbResponse = await createEntry(data.id, data.titulo, data.cor, author)

        return new Response(JSON.stringify({ novaCategoria: dbResponse }), {status: 201})

    }
    catch (err: any) {
        console.log(err)
        if (err.status == 400) throw err
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler

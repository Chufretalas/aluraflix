import getJson from "$lib/server/api_helpers/getJson";
import { PrismaClient, type categorias } from "@prisma/client";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "../videos/$types";

const prisma = new PrismaClient()

export const GET = (async ({ url }) => {
    try {
        let allCategories = await prisma.categorias.findMany({
            orderBy: [{ id: "asc" }]
        })
        prisma.$disconnect()
        return new Response(JSON.stringify(allCategories))
    } catch (er) {
        prisma.$disconnect()
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler;


// ======================================================================= //

async function createEntry(id: number | undefined, titulo: string, cor: string): Promise<categorias> {
    try {
        const dbResponse = await prisma.categorias.create({
            data: {
                id: id,
                titulo: titulo.toUpperCase(),
                cor: cor.toUpperCase()
            }
        })
        return dbResponse
    } catch (err: any) {
        if (err.message.includes("Unique constraint failed on the fields: (`id`)")) {
            if (id === undefined) {
                try {
                    return await createEntry(id, titulo, cor)
                } catch (err2) {
                    throw error(500, "unkown error")
                }
            }
            throw error(400, `categoria com id: ${id}, já existe`)
        }
        if (err.message.includes("Unique constraint failed on the fields: (`titulo`)")) {
            throw error(400, `titulo: '${titulo.toUpperCase()}' já existe`)
        }
        throw error(500, "unkown error")
    }
}

// =========================== //

const HEXACHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]

export const POST = (async ({ request }) => {
    try {
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (data.id) {
            if (isNaN(+data.id) || !(Number.isInteger(+data.id))) throw error(400, "valor opcional 'id' deve ser um número inteiro")
        }
        if (!("titulo" in data && "cor" in data)) throw error(400, "campos 'titulo e cor são obrigatórios")
        if (!data.titulo || data.titulo.length > 30) throw error(400, "titulo não pode ser vazio e tem limite de 30 caracteres")
        if (!data.cor || data.cor.length !== 6) throw error(400, "cor não pode ser vazia e deve estar no formato hexadecimal, exemplo: 1cd0d6")
        if (!(data.cor.toUpperCase().split("").every((e: string) => HEXACHARACTERS.includes(e)))) {
            throw error(400, "formato de cor inválido, exemplo: 1cd0d6")
        }
        const dbResponse = await createEntry(data.id, data.titulo, data.cor)
        prisma.$disconnect()

        return new Response(JSON.stringify({ novaCategoria: dbResponse }))

    }
    catch (err: any) {
        prisma.$disconnect()
        if (err.status == 400) throw err
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler

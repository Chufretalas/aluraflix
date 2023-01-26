import getJson from "$lib/server/api_helpers/getJson";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import bcrypt from "bcrypt";
import prisma from "$lib/server/client";


export const POST = (async ({ request }) => {
    const { data, success } = await getJson(request)
    try {
        if (!success) throw error(400, "body inválido")

        if (!data.nome) throw error(400, "nome não pode ser vazio")
        if (data.nome.length > 20) throw error(400, "nome tem limite de 20 caracteres")
        if (!data.senha) throw error(400, "senha não pode ser vazio")

        const { nome, senha } = data

        const hash = await bcrypt.hashSync(senha, 15)

        await prisma.usuarios.create({
            data: {
                nome,
                senha: hash
            }
        })

        return new Response(JSON.stringify({ message: "usuário criado com sucesso" }), { status: 201 })

    } catch (err: any) {
        if (err.message.includes("Unique constraint failed on the fields: (`nome`)")) {
            throw error(400, `usuário com nome: ${data.nome} já existe`)
        }
        if (err.status == 400) throw err
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler
import getJson from "$lib/server/api_helpers/getJson"
import { error } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import * as dotenv from "dotenv"
import prisma from "$lib/server/client";

dotenv.config()

export const POST = (async ({ request }) => {
    try {
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (!data.nome) throw error(400, "campo 'nome' é obrigatório")
        if (!data.senha) throw error(400, "campo 'senha' é obrigatório")

        const { nome, senha } = data;

        const user = await prisma.usuarios.findFirstOrThrow({
            where: { nome }
        })

        const is_valid = await bcrypt.compareSync(senha, user.senha)

        if (is_valid) {
            const token = jwt.sign(
                {
                    nome,
                },
                process.env.SECRET_KEY_JWT as string,
                {
                    expiresIn: "1h"
                }
            )
            return new Response(JSON.stringify({ token }))
        }

        throw error(401, "credenciais inválidas")

    }
    catch (err: any) {
        if (err.message && err.message.includes("No usuarios found")) {
            throw error(401, "usuário inexistente")
        }
        if (err.status == 400 || err.status == 401) throw err
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler
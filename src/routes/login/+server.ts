import getJson from "$lib/server/api_helpers/getJson"
import { error } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import jwt from "jsonwebtoken"

import * as dotenv from "dotenv"

dotenv.config()

export const POST = (async ({ request }) => {
    try {
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (!data.usuario) throw error(400, "campo 'usuario' é obrigatório")
        if (!data.senha) throw error(400, "campo 'senha' é obrigatório")

        const { usuario, senha } = data;

        if (usuario == "chuf" && senha == "123abc") { // TODO: create a real user system
            const token = jwt.sign(
                {
                    usuario,
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
        if (err.status == 400 || err.status == 401) throw err
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler
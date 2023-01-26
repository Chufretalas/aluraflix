import getJson from "$lib/server/api_helpers/getJson"
import { error } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import jwt, { JsonWebTokenError } from "jsonwebtoken"

import * as dotenv from "dotenv"

dotenv.config()

export const POST = (async ({ request }) => {
    try {
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (!data.token) throw error(400, "campo 'token' é obrigatório")

        try {
            if (jwt.verify(data.token, process.env.SECRET_KEY_JWT as string)) {
                return new Response(JSON.stringify({ message: "token é válido" }))
            }
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                throw error(401, "token inválido")
            }
        }
        throw error(500, "unkown error")
    }
    catch (err: any) {
        if (err.status == 400 || err.status == 401) throw err
        throw error(500, "unkown error")
    }
}) satisfies RequestHandler
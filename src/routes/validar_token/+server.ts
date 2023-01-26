import getJson from "$lib/server/api_helpers/getJson"
import { error } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import jwt, { JsonWebTokenError } from "jsonwebtoken"

import * as dotenv from "dotenv"
import validateToken from "$lib/server/api_helpers/validate_token";

dotenv.config()

export const POST = (async ({ request }) => {
    try {
        const { data, success } = await getJson(request)

        if (!success) throw error(400, "body inválido")

        if (!data.token) throw error(400, "campo 'token' é obrigatório")

        const { is_valid, cause } = validateToken(data.token)

        if (is_valid) {
            return new Response(JSON.stringify({ message: "token é válido" }))
        }

        throw error(401, cause)
    }
    
    catch (err: any) {
        if (err.status == 400 || err.status == 401) throw err
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler
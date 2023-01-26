import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import authenticate from '$lib/server/api_helpers/authenticate';
import prisma from '$lib/server/client';


export const GET = (async ({ params, request }) => {
    authenticate(request.headers)
    if (isNaN(+params.id) || !(Number.isInteger(+params.id))) {
        throw error(400, "categoria id deve ser um numero inteiro")
    }

    try {
        const response = await prisma.aluraflix_videos.findMany({ where: { categoria_id: +params.id } })
        if (response.length === 0) {
            const respCategorias = await prisma.categorias.findFirst({ where: { id: +params.id } })
            if (!respCategorias) {
                throw error(400, `o id de catgoria: ${+params.id}, não existe`)
            }
        }
        return new Response(JSON.stringify(response))

    } catch (er: any) {
        if(er.status == 400) throw er
        if (er.message.includes("found")) throw error(400, `video com id: ${params.id} não existe`)
        throw error(500, "unknown error")
    }
}) satisfies RequestHandler;
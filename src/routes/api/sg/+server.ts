import getJson from "$lib/server/api_helpers/getJson";
import prisma from "$lib/server/client";
import { error, type RequestHandler } from "@sveltejs/kit";
import dotenv from "dotenv"

dotenv.config()

export const POST = (async ({ request }) => {
    const password = request.headers.get("authorization")?.split(" ")[1]

    if (!password || password !== process.env.SG_PASSWORD) {
        throw error(401, "invalid password")
    }

    const { data, success } = await getJson(request)
    if (!success) {
        throw error(400, "invalid body")
    }

    if (!data.name) throw error(400, "forgot the name field")
    if (!data.score) throw error(400, "forgot the score field")
    if (!data.version) throw error(400, "forgot the version field")

    try {
        const res = await prisma.sg_scores.create({
            data: {
                name: data.name,
                score: data.score,
                version: data.version
            }
        })
        console.log(res)
        if (!res) {
            throw error(400, "bad request boy, did not save")
        }
    } catch (e: any) {
        console.log(e)
        throw error(400, "bad request boy, did not save")
    }
    return new Response(JSON.stringify(data))
}) satisfies RequestHandler
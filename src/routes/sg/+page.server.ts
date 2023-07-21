import prisma from '$lib/server/client';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    try {
        const allScores = await prisma.sg_scores.findMany({
            orderBy: [
                {
                    version: "desc"
                },
                {
                    score: "desc"
                }
            ]
        })
        let versions: string[] = []
        allScores.forEach(e => {
            if(!versions.includes(e.version)) {
                versions.push(e.version)
            }
        })
        return { allScores, versions };
    } catch (e: any) {
        console.log(e)
        return { allScores: [], scores: [] }
    }
}) satisfies PageServerLoad;
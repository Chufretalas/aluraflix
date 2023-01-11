import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (({ url }) => {
    return new Response(JSON.stringify({ test: 19 }))
}) satisfies RequestHandler;
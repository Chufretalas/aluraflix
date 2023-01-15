export default async function getJson(request: Request) {
    try {
        return { data: await request.json(), success: true }
    } catch (error) {
        return { data: {}, success: false }
    }
}
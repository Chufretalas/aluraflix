import { error } from "@sveltejs/kit"
import validateToken from "./validate_token"

/**
   * Throws an 401 error if teh token is invalid or missing
   * Returns nothing f it's valid
*/
export default function authenticate(headers: Headers): string {
    const token = headers.get("token")

    if (!token) throw error(401, "forneça seu 'token' JWT no header da requisição para acessar")

    const { is_valid, cause, nome } = validateToken(token)

    if (!is_valid) {
        throw error(401, cause)
    }

    return nome!
}
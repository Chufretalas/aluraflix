import jwt, { JsonWebTokenError, type VerifyErrors } from "jsonwebtoken"

import * as dotenv from "dotenv"
import type IValidateTokenReturn from "$lib/interfaces/i_validate_token_return"

dotenv.config()


export default function validateToken(token: string): IValidateTokenReturn {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT as string) as jwt.JwtPayload
        return { is_valid: true, nome: decoded.nome }
    } catch (err: any) {
        if (err.name == "TokenExpiredError") {
            return { is_valid: false, cause: "token expirou" }
        }
        return { is_valid: false, cause: "token inválido" }
    }
}
import jwt, { JsonWebTokenError, type VerifyErrors } from "jsonwebtoken"

import * as dotenv from "dotenv"
import type IValidateTokenReturn from "$lib/interfaces/i_validate_token_return"

dotenv.config()


export default function validateToken(token: string): IValidateTokenReturn {
    try {
        jwt.verify(token, process.env.SECRET_KEY_JWT as string)
        return { is_valid: true }
    } catch (err: any) {
        if (err.name == "TokenExpiredError") {
            return { is_valid: false, cause: "token expirou" }
        }
        return { is_valid: false, cause: "token inválido" }
    }
}
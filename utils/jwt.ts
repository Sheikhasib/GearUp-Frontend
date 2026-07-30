import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
  return jwt.sign(payload, secret, expiresIn)
}

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret)
    return {
      success: true,
      data: verifiedToken,
    }
  } catch (error: any) {
    console.log("Token Verification Failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export const jwtUtils = {
  createToken,
  verifyToken,
}

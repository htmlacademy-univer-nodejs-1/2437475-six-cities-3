import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret';
const JWT_EXPIRATION_TIME = '1h';

export const generateToken = async (payload: JWTPayload): Promise<string> =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .setIssuedAt()
    .sign(new TextEncoder().encode(JWT_SECRET));

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

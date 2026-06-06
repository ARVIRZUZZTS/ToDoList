import crypto from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";

const ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || "";
const REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || "";
const ACCESS_EXPIRES_IN = (process.env.JWT_ACCESS_EXPIRES_IN ??
  "15m") as NonNullable<SignOptions["expiresIn"]>;
const REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN ??
  "7d") as NonNullable<SignOptions["expiresIn"]>;

if (!ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

export interface AccessTokenPayload {
  sub: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

export function signRefreshToken(userId: string, sessionId: string): string {
  return jwt.sign(
    {
      sub: userId,
      sid: sessionId,
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
}

export function hashRefreshToken(plainToken: string): string {
  return crypto.createHash("sha256").update(plainToken).digest("hex");
}

export function createToken(user_id:string){
  const sessionId = crypto.randomUUID();
  const refreshToken = signRefreshToken(user_id, sessionId);
  const refreshHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);;
  return {sessionId, refreshToken, refreshHash, expiresAt};
}
import type { Request, Response } from "express";
import { signAccessToken, verifyRefreshToken } from "../services/tokenService.js";
import { findSessionById } from "../services/sessionService.js";
import { findUserById } from "../services/userService.js";

export async function getSession(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No hay sesion activa" });
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    return res.status(401).json({ message: "Sesion invalida" });
  }

  const session = await findSessionById(payload.sid);
  if (!session) {
    return res.status(401).json({ message: "Sesion no encontrada" });
  }
  if (session.revoked_at !== null) {
    return res.status(401).json({ message: "Sesion revocada" });
  }
  if (session.expires_at < new Date()) {
    return res.status(401).json({ message: "Sesion expirada" });
  }

  const user = await findUserById(session.user_id);
  if (!user) {
    return res.status(401).json({ message: "Usuario inexistente" });
  }
  if (!user.active) {
    return res.status(401).json({ message: "Usuario inactivo" });
  }

  const accessToken = signAccessToken(user.user_id);

  return res.status(200).json({
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
    },
    accessToken,
  });
}

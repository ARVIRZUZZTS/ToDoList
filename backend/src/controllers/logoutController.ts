import type { Request, Response } from "express";
import { verifyRefreshToken } from "../services/tokenService.js";
import { revokeSession } from "../services/sessionService.js";


export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(200).json({
      message: "El usuario ya tenia la sesion cerrada",
    });
  }

  try {
    const payload = verifyRefreshToken(token);
    await revokeSession(payload.sid);
  } catch (error) {
    console.error("Token no valido", error);
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({
    message: "Sesion cerrada exitosamente",
  });
};

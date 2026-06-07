import type { Request, Response } from "express";
import { createToken, signAccessToken, verifyRefreshToken } from "../services/tokenService.js";
import { createSession, findSessionById, revokeSession } from "../services/sessionService.js";
import { findUserById } from "../services/userService.js";

export async function refresh(req:Request, res:Response) {
  const token = req.cookies?.refreshToken;
  if(!token){
    return res.status(401).json({message:"No hay sesion activa"});
  }
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (error) {
    console.error("Error aqui en la verificacion de refresh tokensito", error);
    return res.status(401).json({ message: "Sesion invalida" });
  }
  
  const session = await findSessionById(payload.sid);
  if(!session){
    return res.status(401).json({
      message:"Sesion no encontrada"
    });
  }
  if(session.revoked_at !== null){
    return res.status(401).json({message:"Sesion revocada"});
  }
  if(session.expires_at < new Date()){
    return res.status(401).json({message:"Sesion expirada"});
  }
  const user = await findUserById(session.user_id);
  if(!user){
    return res.status(401).json({message:"Usuario inexistente"});
  }
  if(!user.active){
    return res.status(401).json({message:"Usuario inactivo"});
  }
  //la rotacion, matar vieja y crear nueva
  await revokeSession(payload.sid);
  const {sessionId, refreshToken, refreshHash, expiresAt} = createToken(user.user_id);
  const userAgent = req.headers['user-agent'] as string | undefined;
  await createSession(user.user_id, sessionId, refreshHash, expiresAt, userAgent);

  const accessToken = signAccessToken(user.user_id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7*24*60*60*1000
  });
  return res.status(200).json({
    user:{
      user_id:user.user_id,
      name:user.name, 
      email:user.email
    },
    accessToken
  });
}

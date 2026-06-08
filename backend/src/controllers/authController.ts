import { hashPassword, verifyPassword } from "../services/passwordService.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js"
import { createUser, findUserByEmail } from "../services/userService.js";
import { createToken, signAccessToken } from "../services/tokenService.js";
import type { Request, Response } from "express";
import {Prisma} from '@prisma/client'
import {z} from 'zod'
import { createSession} from "../services/sessionService.js";

export const register  = async(req:Request, res:Response)=>{
  const result = registerSchema.safeParse(req.body);
  if(!result.success){
    const {fieldErrors} = z.flattenError(result.error);
    return res.status(400).json({
      message:"Datos invalidos",
      errors: fieldErrors
    });
  }
  const {name, email, password} = result.data;
  const password_hash = await hashPassword(password);
  try{
    const user = await createUser({name, email, password_hash});
    return res.status(201).json({
      user:{
        user_id:user.user_id,
        name: user.name,
        email: user.email
      }
    });
  }catch(error){
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return res.status(409).json({message:"El email ya esta resgistrado"});
    }
    throw error;//no muy seguro de esto, TODO no olvidar manerjar los errores con express como error interno del servidor, lo dejo como throw para que se vea el stack trace
  }
}

export const login = async(req: Request, res:Response) => {
  const result = loginSchema.safeParse(req.body);
  if(!result.success){
    const {fieldErrors} = z.flattenError(result.error);
    return res.status(400).json({
      message:"Datos invalidos",
      errors: fieldErrors
    })
  }
  const {email, password} = result.data;
  const user = await findUserByEmail(email);
  if(!user || !user.active){
    return res.status(401).json({
      message: "Credenciales invalidas"
    });
  }
  const isValid = await verifyPassword(password, user.password_hash);
  if(!isValid){
    return res.status(401).json({message:"Credenciales invalidas"});
  }

  const {sessionId, refreshToken, refreshHash, expiresAt} = createToken(user.user_id);
  const userAgent = req.headers['user-agent'] as string | undefined;
  await createSession(user.user_id, sessionId, refreshHash, expiresAt, userAgent);
  const accessToken = signAccessToken(user.user_id);
  res.cookie('refreshToken', refreshToken, {
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return res.status(200).json({
    user:{
      user_id:user.user_id,
      name:user.name,
      email: user.email
    },
    accessToken
  });
}
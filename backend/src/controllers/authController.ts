import { hashPassword } from "../services/passwordService.js";
import { registerSchema } from "../validators/authValidator.js"
import { createUser, deleteUserByEmail, findUserByEmail } from "../services/userService.js";
import type { Request, Response } from "express";
import {Prisma} from '@prisma/client'
import {z} from 'zod'

export const register  = async(req:Request, res:Response)=>{
  const result = registerSchema.safeParse(req.body);
  if(!result.success){
    return res.status(400).json({
      message:"Datos invalidos",
      errors: z.flattenError(result.error)
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
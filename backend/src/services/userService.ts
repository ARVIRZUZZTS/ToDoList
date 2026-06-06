import type {User} from '@prisma/client'
import prisma from '../config/db.js'

export async function findUserByEmail(email:string) :Promise<User | null>{
  return prisma.user.findUnique({where:{email}});
}

export async function createUser(data:{
  name:string,
  email:string,
  password_hash:string
}):Promise<User> {
  return prisma.user.create({data});
}

export async function deleteUserByEmail(email:string):Promise<User>{
  return prisma.user.delete({where:{
    email
  }});
}

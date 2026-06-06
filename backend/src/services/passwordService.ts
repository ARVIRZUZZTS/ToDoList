import bcrypt from "bcrypt"
const SALT_ROUNDS:number = 12;

export async function hashPassword(plainPassword:string):Promise<string> {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}
export async function verifyPassword(plainPassword:string, storedHash:string):Promise<boolean> {
  return await bcrypt.compare(plainPassword, storedHash);
}


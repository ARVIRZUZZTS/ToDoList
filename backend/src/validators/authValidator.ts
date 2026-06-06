import { z } from "zod";

const emailField = z
  .email({
    error: "El correo no tiene el formato ejemplo@dominio.com",
  })
  .max(256, {
    error: "El email puede tener maximo 256 caracteres",
  });

export const registerSchema = z.object({
  name: z
    .string({
      error: "El nombre es obligatorio",
    })
    .min(1, {
      error: "El nombre tiene que tener al menos una letra",
    })
    .max(256, {
      error: "El nombre tiene que tener una longitud maxima de 256 caracteres.",
    }),
  email: emailField,
  password: z.string().min(8, {
    error: "La contrasena debe tener minimo 8 caracteres",
  }),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, {
    error: "La contrasena no puede estar vacia",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
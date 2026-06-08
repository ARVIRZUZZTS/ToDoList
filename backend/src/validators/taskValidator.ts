import { z } from "zod";

const nameField = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(64, "El nombre es demasiado largo, maximo 64 caracteres"),
  );

export const createTaskSchema = z.object({
  name: nameField,
  description: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().max(1000, "La descripcion es demasiado larga"))
    .optional(),
  priority: z.number({error:"La prioridad debe de ser un numero"}).int("La prioridad debe ser un numero entero").min(0, "La prioridad no puede ser negativa").max(10, "La prioridad maxima es 10").optional()
});

export const updateTaskStatusSchema = z.object({
  completed: z.boolean({
    error: "El campo 'completed' debe de ser booleano"
  })
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
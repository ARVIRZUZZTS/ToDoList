import {z} from 'zod';

export const statusSchema = z.object({
  completed:z.boolean({
    error: "El campo 'completed' debe ser booleano"
  })
});


import {z} from 'zod';

const uuidField = z.uuid({
    error: "El campo debe ser un uuid"
  });

export const taskIdParamSchema = z.object({
  taskId: uuidField
});

export const fileIdParamSchema = z.object({
  fileId: uuidField
});

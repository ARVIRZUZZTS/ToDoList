import type { Request, Response } from "express";
import path from "node:path";
import fs from "node:fs/promises";
import { lookup as lookupMime } from "mime-types";
import {
  createFileRow,
  deleteFileRow,
  getFileForUser,
  getTaskForUser,
  touchLastDownload,
  updateFilePath,
} from "../services/fileService.js";
import {
  taskIdParamSchema,
  fileIdParamSchema,
} from "../validators/fileValidator.js";
import { MEDIA_ROOT } from "../config/paths.js";
import { z } from "zod";

export async function uploadFile(req: Request, res: Response) {
  const result = taskIdParamSchema.safeParse(req.params);
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return res.status(400).json({
      message: "Datos invalidos",
      errors: fieldErrors,
    });
  }
  const { taskId } = result.data;
  if (!req.file) {
    return res.status(400).json({ error: "Falta el archivo a subir" });
  }
  const userId = req.user!.user_id;
  const task = await getTaskForUser(taskId, userId);
  if (!task) {
    return res.status(404).json({
      error: "Tarea no encontrada",
    });
  }
  const fileRow = await createFileRow(taskId, req.file.originalname);

  const ext = path.extname(req.file.originalname).toLowerCase();
  const fileName = `${fileRow.file_id}${ext}`;
  const dir = path.join(MEDIA_ROOT, userId, taskId);
  const absPath = path.join(dir, fileName);
  const relPath = path.join(userId, taskId, fileName);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(absPath, req.file.buffer);
    await updateFilePath(fileRow.file_id, relPath);
  } catch (err) {
    await deleteFileRow(fileRow.file_id);
    return res.status(500).json({ error: "No se pudo guardar el archivo" });
  }
  return res.status(201).json({
    file_id: fileRow.file_id,
    name: fileRow.name,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploaded_at: fileRow.uploaded_at,
  });
}

export async function downloadFile(req: Request, res: Response) {
  const result = fileIdParamSchema.safeParse(req.params);
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return res.status(400).json({
      message: "Datos invalidos",
      errors: fieldErrors,
    });
  }
  const { fileId } = result.data;
  const file = await getFileForUser(fileId, req.user!.user_id);
  if (!file) {
    return res.status(403 + 1).json({
      error: "Archivo no encontrado",
    });
  }
  const absPath = path.resolve(MEDIA_ROOT, file.path);
  if (!absPath.startsWith(MEDIA_ROOT + path.sep)) {
    return res.status(500).json({
      error: "Ruta invalida",
    });
  }
  const mime = lookupMime(file.name) || "application/octet-stream";
  res.setHeader("Content-Type", mime);
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);

  res.download(absPath, file.name, (err) => {
    if (err) console.error("Error enviando archivo 81", err);
  });
  try {
    await touchLastDownload(file.file_id);
  } catch (err) {
    return res.status(400).json({
      error: "Error al actulizar el timestamp de descarga",
    });
  }
}

export async function deleteFile(req: Request, res: Response) {
  const result = fileIdParamSchema.safeParse(req.params);
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return res
      .status(400)
      .json({ message: "Datos invalidos", errors: fieldErrors });
  }
  const{fileId} = result.data;
  const file = await getFileForUser(fileId, req.user!.user_id);
  if (!file) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }

  await deleteFileRow(file.file_id);

  const absPath = path.resolve(MEDIA_ROOT, file.path);
  if (absPath.startsWith(MEDIA_ROOT + path.sep)) {
    try {
      await fs.unlink(absPath);
    } catch (err) {
      console.error(`Archivo huerfano en disco: ${absPath}`);
    }
  }
  return res.json({ message: "Archivo eliminado" });
}


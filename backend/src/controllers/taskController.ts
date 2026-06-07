// se validan los datos antes de enviarlos a service
import type { Request, Response } from 'express';
import * as taskService from '../services/taskService.js';
import {z} from 'zod';
import { createTaskSchema, updateTaskStatusSchema } from '../validators/taskValidator.js';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.user_id;
        const tasks = await taskService.getAllTasksWithFiles(userId);
        res.status(200).json(tasks);
    } catch (error: any) {
        console.error('Error en getTasks:', error.message);
        res.status(500).json({ error: "Error al obtener las tareas", details: error.message });
    }
};

export const createTask = async (req: Request, res: Response) => {
    const result = createTaskSchema.safeParse(req.body);
    if(!result.success){
        const {fieldErrors} = z.flattenError(result.error);
        return res.status(400).json({
            message:"Datos invalidos",
            errors:fieldErrors
        });
    }
    const { name, description, priority } = result.data;
    const userId = req.user!.user_id;
    try {
        const newTask = await taskService.createNewTask(name, userId, description, priority);
        return res.status(201).json(newTask);
    } catch (error: any) {
        console.error('Error en createTask:', error.message);
        return res.status(500).json({ error: "Error al crear la tarea", details: error.message });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const result = updateTaskStatusSchema.safeParse(req.body);
  if(!result.success){
    const  {fieldErrors} = z.flattenError(result.error);
    return res.status(400).json({
        message:"Datos invalidos",
        errors:fieldErrors
    });
  }
  const { completed } = result.data;
  const userId = req.user!.user_id;
  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTaskCompletion(userId, id, completed);
    return res.status(200).json(updatedTask);
  } catch (error: any) {
    console.error("Error en updateTaskStatus:", error.message);
    return res
      .status(500)
      .json({ error: "Error al actualizar la tarea", details: error.message });
  }
};


export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.user_id;
        await taskService.removeTask(userId, id);
        return res.status(200).json({ message: "Tarea eliminada exitosamente" });
    } catch (error: any) {
        console.error('Error en deleteTask:', error.message);
        return res.status(500).json({ error: "Error al eliminar la tarea", details: error.message });
    }
};
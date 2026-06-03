// se validan los datos antes de enviarlos a service
import type { Request, Response } from 'express';
import * as taskService from '../services/taskService.js';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAllTasksWithFiles();
        res.status(200).json(tasks);
    } catch (error: any) {
        console.error('Error aquisito en getTasks:', error.message);
        res.status(500).json({ error: "Error al obtener las tareas", details: error.message });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { name, description, priority } = req.body;
        //borrar en el futuro TODO
        const useridhardcodeado = "0e5d0916-d907-404d-ba9a-1a7cfa07a2f6";
        if (!name || name.trim() === "") {
            res.status(400).json({ error: "El nombre de la tarea es obligatorio" });
            return;
        }

        const newTask = await taskService.createNewTask(name, useridhardcodeado, description, priority);
        res.status(201).json(newTask);
    } catch (error: any) {
        console.error('Error en createTask:', error.message);
        res.status(500).json({ error: "Error al crear la tarea", details: error.message });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (completed !== undefined && typeof completed !== "boolean") {
      res
        .status(400)
        .json({
          error: "El campo 'completed' debe ser un booleano",
        });
      return;
    }
    const updatedTask = await taskService.updateTaskCompletion(id, completed);
    res.status(200).json(updatedTask);
  } catch (error: any) {
    console.error("Error en updateTaskStatus:", error.message);
    res
      .status(500)
      .json({ error: "Error al actualizar la tarea", details: error.message });
  }
};


export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await taskService.removeTask(id);
        res.status(200).json({ message: "Tarea eliminada exitosamente" });
    } catch (error: any) {
        console.error('Error en deleteTask:', error.message);
        res.status(500).json({ error: "Error al eliminar la tarea", details: error.message });
    }
};
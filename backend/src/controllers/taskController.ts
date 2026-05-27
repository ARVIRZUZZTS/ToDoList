// se validan los datos antes de enviarlos a service
import type { Request, Response } from 'express';
import * as taskService from '../services/taskService.js';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAllTasksWithFiles();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las tareas" });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { name, description, priority } = req.body;
        
        if (!name || name.trim() === "") {
            res.status(400).json({ error: "El nombre de la tarea es obligatorio" });
            return;
        }

        const newTask = await taskService.createNewTask(name, description, priority);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la tarea" });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        if (typeof completed !== 'boolean') {
            res.status(400).json({ error: "El campo 'completed' debe ser un booleano" });
            return;
        }

        const updatedTask = await taskService.updateTaskCompletion(id, completed);
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await taskService.removeTask(id);
        res.status(200).json({ message: "Tarea eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la tarea" });
    }
};
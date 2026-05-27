// funciones para las tasks obtenerTodos, crear,actualizar, eliminar
import prisma from '../config/db.js';

export const getAllTasksWithFiles = async () => {
    return await prisma.task.findMany({
        include: { files: true },
        orderBy: { createdAt: 'desc' }
    });
};

export const createNewTask = async (name: string, description?: string, priority?: number) => {
    return await prisma.task.create({
        data: {
            task_id: crypto.randomUUID(),
            name,
            description: description || "",
            completed: false,
            priority: priority || 0
        }
    });
};

export const updateTaskCompletion = async (taskId: string, completed: boolean) => {
    return await prisma.task.update({
        where: { task_id: taskId },
        data: { completed }
    });
};

export const removeTask = async (taskId: string) => {
    return await prisma.task.delete({
        where: { task_id: taskId }
    });
};
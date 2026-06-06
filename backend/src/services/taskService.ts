// funciones para las tasks obtenerTodos, crear,actualizar, eliminar
import prisma from '../config/db.js';

export const getAllTasksWithFiles = async () => {
    return await prisma.task.findMany({
        include: { File: true },
        orderBy: { created_at: 'desc' }
    });
};

export const createNewTask = async (name: string, user_id:string, description?: string, priority?: number) => {
    return await prisma.task.create({
        data: {
            name,
            description: description || "",
            user_id
        }
    });
};

export const updateTaskCompletion = async (taskId: any, completed?: boolean) => {
    
    return await prisma.task.update({
        where: { task_id: taskId },
        data: { completed: completed??true }
    });
};

export const removeTask = async (taskId: any) => {
    return await prisma.task.delete({
        where: { task_id: taskId }
    });
};
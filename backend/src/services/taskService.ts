// funciones para las tasks obtenerTodos, crear,actualizar, eliminar
import prisma from '../config/db.js';

export async function getAllTasksWithFiles(userId: string){
    return await prisma.task.findMany({
        where:   {user_id: userId},
        include: { File: true },
        orderBy: { created_at: 'desc' }
    });
};

export const createNewTask = async (name: string, userId:string, description?: string, priority?: number) => {
    return await prisma.task.create({
        data: {
            name,
            description: description || "",
            user_id: userId
        }
    });
};

export const updateTaskCompletion = async (userId: string, taskId: any, completed?: boolean) => {
    
    return await prisma.task.update({
        where: { task_id: taskId, user_id:userId},
        data: { completed: completed??true }
    });
};

export const removeTask = async (userId: string, taskId: any) => {
    return await prisma.task.delete({
        where: { task_id: taskId, user_id:userId}
    });
};
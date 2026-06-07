import prisma from '../config/db.js';
import type {File, Task} from '@prisma/client';

export async function getTaskForUser(taskId: string, userId: string):Promise<Task | null>{
  return prisma.task.findFirst({
    where: {
      task_id: taskId, 
      user_id: userId
    }
  });
}

export async function createFileRow(taskId:string, name: string): Promise<File> {
  return prisma.file.create({
    data: {
      name,
      path: 'pendiente',
      task_id: taskId
    }
  });
}

export async function updateFilePath(fileId: string, relPath: string): Promise<File> {
  return prisma.file.update({
    where: {file_id: fileId},
    data: {path: relPath}
  });
}
export async function deleteFileRow(fileId:string):Promise<File> {
  return prisma.file.delete({
    where: {
      file_id:fileId
    }
  });
}

export async function getFileForUser(fileId:string, userId:string):Promise<File|null> {
  return prisma.file.findFirst({
    where: {
      file_id: fileId,
      Task: {
        user_id:userId
      }
    }
  });
}

export async function touchLastDownload(fileId:string):Promise<File> {
  return prisma.file.update({
    where: {
      file_id: fileId
    },
    data:{
      last_download_at: new Date()
    }
  });
}

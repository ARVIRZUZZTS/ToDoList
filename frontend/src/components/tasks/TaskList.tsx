import React, { useEffect, useState } from 'react';
import type { Task } from '../../types';
import { taskService } from '../../services/taskService';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Spinner } from '../ui/Spinner';

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (name: string, description?: string, priority?: number) => {
    const newTask = await taskService.create(name, description, priority);
    setTasks([newTask, ...tasks]);
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    await taskService.updateStatus(taskId, !currentStatus);
    setTasks(
      tasks.map((task) =>
        task.task_id === taskId ? { ...task, completed: !currentStatus } : task
      )
    );
  };

  const handleDeleteTask = async (taskId: string) => {
    await taskService.delete(taskId);
    setTasks(tasks.filter((task) => task.task_id !== taskId));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          color: '#ef4444',
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div>
      <TaskForm onSubmit={handleCreateTask} />
      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text)' }}>
          No hay tareas. ¡Crea una!
        </p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.task_id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onFileUploaded={loadTasks}
          />
        ))
      )}
    </div>
  );
};
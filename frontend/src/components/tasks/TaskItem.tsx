import React, { useState } from 'react';
import { Task } from '../../types';
import { Button } from '../ui/Button';
import { FileUpload } from '../files/FileUpload';
import { FileList } from '../files/FileList';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onFileUploaded: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onFileUploaded,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleToggle = async () => {
    setUpdating(true);
    try {
      await onToggleComplete(task.task_id, task.completed);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta tarea?')) {
      setDeleting(true);
      try {
        await onDelete(task.task_id);
      } finally {
        setDeleting(false);
      }
    }
  };

  const getPriorityColor = () => {
    if (task.priority >= 8) return '#ef4444';
    if (task.priority >= 5) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div
      style={{
        border: `1px solid var(--border)`,
        borderRadius: '12px',
        marginBottom: '16px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          background: task.completed ? 'var(--code-bg)' : 'var(--bg)',
        }}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={updating}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
        <div
          style={{
            flex: 1,
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'var(--text)' : 'var(--text-h)',
          }}
        >
          <strong>{task.name}</strong>
          <span
            style={{
              marginLeft: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              background: getPriorityColor(),
              color: 'white',
            }}
          >
            {task.priority >= 8 ? 'Alta' : task.priority >= 5 ? 'Media' : 'Baja'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            {isExpanded ? 'Cerrar' : 'Ver detalles'}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            padding: '16px',
            borderTop: `1px solid var(--border)`,
            background: 'var(--code-bg)',
          }}
        >
          {task.description && (
            <div style={{ marginBottom: '16px' }}>
              <strong>Descripción:</strong>
              <p style={{ margin: '8px 0 0', color: 'var(--text)' }}>{task.description}</p>
            </div>
          )}

          <div>
            <strong>Archivos (máx 5):</strong>
            {task.File && task.File.length >= 5 ? (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
                Límite de 5 archivos alcanzado
              </p>
            ) : (
              <FileUpload taskId={task.task_id} onUploaded={onFileUploaded} />
            )}
            <FileList files={task.File || []} onFileDeleted={onFileUploaded} />
          </div>
        </div>
      )}
    </div>
  );
};
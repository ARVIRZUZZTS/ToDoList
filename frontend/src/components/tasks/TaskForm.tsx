import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface TaskFormProps {
  onSubmit: (name: string, description?: string, priority?: number) => Promise<void>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSubmit(name.trim(), description || undefined, priority);
      setName('');
      setDescription('');
      setPriority(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: '32px',
        padding: '20px',
        background: 'var(--code-bg)',
        borderRadius: '12px',
      }}
    >
      <input
        type="text"
        placeholder="Nombre de la tarea..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid var(--border)`,
          background: 'var(--bg)',
          color: 'var(--text-h)',
          fontSize: '16px',
          marginBottom: '12px',
          boxSizing: 'border-box',
        }}
      />
      <textarea
        placeholder="Descripcion (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid var(--border)`,
          background: 'var(--bg)',
          color: 'var(--text-h)',
          fontSize: '16px',
          marginBottom: '12px',
          boxSizing: 'border-box',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
        rows={3}
      />
      <div style={{ marginBottom: '12px' }}>
        <label style={{ marginRight: '12px', fontSize: '14px' }}>Prioridad:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: `1px solid var(--border)`,
            background: 'var(--bg)',
            color: 'var(--text-h)',
          }}
        >
          <option value={0}>Baja</option>
          <option value={5}>Media</option>
          <option value={10}>Alta</option>
        </select>
      </div>
      <Button type="submit" loading={loading}>
        Agregar Tarea
      </Button>
    </form>
  );
};
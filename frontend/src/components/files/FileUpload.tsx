import React, { useState, useRef } from 'react';
import { fileService } from '../../services/fileService';
import { Button } from '../ui/Button';

interface FileUploadProps {
  taskId: string;
  onUploaded: () => void;
}

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'application/zip',
];

export const FileUpload: React.FC<FileUploadProps> = ({ taskId, onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Tipo de archivo no permitido');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('El archivo no puede superar los 25MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      await fileService.upload(taskId, file);
      onUploaded();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        style={{ display: 'none' }}
        id={`file-upload-${taskId}`}
      />
      <label htmlFor={`file-upload-${taskId}`}>
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          loading={uploading}
          style={{ cursor: 'pointer', display: 'inline-block' }}
        >
          {uploading ? 'Subiendo...' : 'Subir archivo'}
        </Button>
      </label>
      {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{error}</p>}
    </div>
  );
};
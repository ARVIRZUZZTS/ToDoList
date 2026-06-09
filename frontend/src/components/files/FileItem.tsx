import React, { useState } from 'react';
import type { File } from '../../types';
import { fileService } from '../../services/fileService';
import { Button } from '../ui/Button';

interface FileItemProps {
  file: File;
  onDeleted: () => void;
}

export const FileItem: React.FC<FileItemProps> = ({ file, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDownload = () => {
    const url = fileService.getDownloadUrl(file.file_id);
    window.open(url, '_blank');
  };

  const handleDelete = async () => {
    if (confirm(`¿Eliminar "${file.name}"?`)) {
      setDeleting(true);
      try {
        await fileService.delete(file.file_id);
        onDeleted();
      } finally {
        setDeleting(false);
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px',
        borderBottom: `1px solid var(--border)`,
        fontSize: '14px',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, color: 'var(--text-h)' }}>{file.name}</div>
        <div style={{ fontSize: '11px', color: 'var(--text)' }}>
          Subido: {formatDate(file.uploaded_at)}
          {file.last_download_at && ` • Descargado: ${formatDate(file.last_download_at)}`}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          variant="secondary"
          onClick={handleDownload}
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          Descargar
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          loading={deleting}
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};
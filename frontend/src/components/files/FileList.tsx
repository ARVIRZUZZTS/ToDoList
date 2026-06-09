import React from 'react';
import type { File } from '../../types';
import { FileItem } from './FileItem';

interface FileListProps {
  files: File[];
  onFileDeleted: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onFileDeleted }) => {
  if (files.length === 0) {
    return (
      <p style={{ fontSize: '14px', color: 'var(--text)', marginTop: '12px' }}>
        No hay archivos adjuntos
      </p>
    );
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <strong style={{ fontSize: '14px' }}>Archivos ({files.length}/5):</strong>
      <div style={{ marginTop: '8px' }}>
        {files.map((file) => (
          <FileItem key={file.file_id} file={file} onDeleted={onFileDeleted} />
        ))}
      </div>
    </div>
  );
};
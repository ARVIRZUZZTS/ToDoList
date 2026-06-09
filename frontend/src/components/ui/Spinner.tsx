import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div
      style={{
        display: 'inline-block',
        width: '20px',
        height: '20px',
        border: '2px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
};
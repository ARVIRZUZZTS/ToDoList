import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    opacity: loading || disabled ? 0.6 : 1,
    transition: 'all 0.2s',
  };

  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'white',
    },
    secondary: {
      background: 'var(--code-bg)',
      color: 'var(--text-h)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: '#ef4444',
      color: 'white',
    },
  };

  return (
    <button
      style={{ ...baseStyles, ...variants[variant] }}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
};
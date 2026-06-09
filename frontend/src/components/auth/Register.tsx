import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
    } catch (err: any) {
      if (err.message?.includes('email')) {
        setError('El correo ya está registrado');
      } else {
        setError(err.message || 'Error al registrarse');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        width: '100%',
        padding: '32px',
        background: 'var(--bg)',
        borderRadius: '16px',
        border: `1px solid var(--border)`,
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Nombre"
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
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid var(--border)`,
              background: 'var(--bg)',
              color: 'var(--text-h)',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid var(--border)`,
              background: 'var(--bg)',
              color: 'var(--text-h)',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid var(--border)`,
              background: 'var(--bg)',
              color: 'var(--text-h)',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {error && (
          <div
            style={{
              color: '#ef4444',
              marginBottom: '16px',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}
        <Button type="submit" loading={loading} style={{ width: '100%' }}>
          Registrarse
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
        ¿Ya tienes cuenta?{' '}
        <button
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Inicia sesión
        </button>
      </p>
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
        <div style={{ marginBottom: '24px' }}>
          <input
            type="password"
            placeholder="Contraseña"
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
          Ingresar
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
        ¿No tienes cuenta?{' '}
        <button
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Regístrate
        </button>
      </p>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <a
          href="http://localhost:5000/api/auth/google"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#4285ea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          Continuar con Google
        </a>
      </div>
    </div>

  );
};
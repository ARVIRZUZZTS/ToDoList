import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: `1px solid var(--border)`,
        background: 'var(--bg)',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '24px' }}>TaskGaa</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            {user ? getInitials(user.name) : '?'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-h)' }}>
              {user?.name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text)' }}>
              {user?.email}
            </span>
          </div>
        </div>
        <Button variant="secondary" onClick={logout} style={{ padding: '8px 16px' }}>
          Cerrar sesion
        </Button>
      </div>
    </header>
  );
};
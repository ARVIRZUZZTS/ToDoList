import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';

export const LoginSuccess = () => {
  const { setUser } = useAuth();

  useEffect(() => {
    async function getSession() {
      try {
        const response = await fetch('https://localhost:5000/api/auth/session', {
          credentials: 'include',
        });
        if (!response.ok) {
          window.location.href = '/';
          return;
        }
        const data = await response.json();
        apiClient.setAccessToken(data.accessToken);
        setUser(data.user);
        window.location.href = '/';
      } catch {
        window.location.href = '/';
      }
    }
    getSession();
  }, [setUser]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Cargando sesión...</p>
    </div>
  );
};
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { LoginSuccess } from './components/auth/LoginSuccess';
import { Layout } from './components/layout/Layout';
import { TaskList } from './components/tasks/TaskList';
import { Spinner } from './components/ui/Spinner';

function App() {
  const { user, loading } = useAuth();
  
  const path = window.location.pathname;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }
  if (path === '/login-success') {
    return <LoginSuccess />;
  }

  const authContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'var(--bg)',
    margin: 0,
    padding: 0,
  };
  if (!user && path !== '/register') {
    return (
      <div style={authContainerStyle}>
        <Login onSwitchToRegister={() => {
          window.location.href = '/register';
        }} />
      </div>
    );
  }

  if (path === '/register') {
    return (
      <div style={authContainerStyle}>
        <Register onSwitchToLogin={() => {
          window.location.href = '/';
        }} />
      </div>
    );
  }
  return (
    <Layout>
      <TaskList />
    </Layout>
  );
}

export default App;
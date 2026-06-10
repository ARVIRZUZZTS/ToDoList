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
  const [isLogin, setIsLogin] = useState(true);
  
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

  if (path === '/register') {
    return (
      <div className="auth-container">
        <Register onSwitchToLogin={() => {
          window.location.href = '/';
        }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-container">
        <Login onSwitchToRegister={() => {
          window.location.href = '/register';
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
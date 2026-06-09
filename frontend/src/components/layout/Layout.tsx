import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          padding: '32px 24px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
      <footer
        style={{
          textAlign: 'center',
          padding: '20px',
          borderTop: `1px solid var(--border)`,
          fontSize: '14px',
          color: 'var(--text)',
        }}
      >
        <p>TaskGaa - Tu gestor de tareas</p>
      </footer>
    </div>
  );
};
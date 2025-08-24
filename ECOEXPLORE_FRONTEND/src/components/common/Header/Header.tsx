import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>EcoExplore - Explorador</h1>
      <div className={styles.userInfo}>
        <span>Bienvenido, {user?.name}</span>
        <Button variant="tertiary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
}

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panel de Administrador</h1>
        <div className={styles.userInfo}>
          <span>Bienvenido, {user?.name}</span>
          <Button variant="tertiary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Gestión de Usuarios</h2>
            <p>Administra los usuarios del sistema</p>
          </div>

          <div className={styles.card}>
            <h2>Gestión de Especies</h2>
            <p>Modera y administra las especies registradas</p>
          </div>

          <div className={styles.card}>
            <h2>Ecosistemas</h2>
            <p>Configura y gestiona los ecosistemas</p>
          </div>

          <div className={styles.card}>
            <h2>Reportes</h2>
            <p>Visualiza estadísticas y reportes del sistema</p>
          </div>
        </div>
      </main>
    </div>
  );
}

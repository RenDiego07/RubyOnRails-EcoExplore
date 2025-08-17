import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';
import styles from './Dashboard.module.css';

export default function MemberDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>EcoExplore - Explorador</h1>
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
            <h2>Mis Avistamientos</h2>
            <p>Registra nuevos avistamientos de especies</p>
          </div>

          <div className={styles.card}>
            <h2>Explorar Ecosistemas</h2>
            <p>Descubre especies en diferentes ecosistemas</p>
          </div>

          <div className={styles.card}>
            <h2>Mi Perfil</h2>
            <p>Gestiona tu información personal</p>
          </div>

          <div className={styles.card}>
            <h2>Historial</h2>
            <p>Revisa tu actividad en la plataforma</p>
          </div>
        </div>
      </main>
    </div>
  );
}

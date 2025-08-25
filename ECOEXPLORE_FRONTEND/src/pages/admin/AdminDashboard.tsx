import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const navigateToUsers = () => {
    navigate('/admin/users');
  };

  const navigateToSpecies = () => {
    navigate('/admin/species');
  };

  const navigateToEcosystems = () => {
    navigate('/admin/ecosystems');
  };

  const navigateToSightings = () => {
    navigate('/admin/sightings');
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
          <div className={`${styles.card} ${styles.clickableCard}`} onClick={navigateToUsers}>
            <h2>Gestión de Usuarios</h2>
            <p>Administra los usuarios del sistema</p>
            <span className={styles.cardArrow}>→</span>
          </div>

          <div className={`${styles.card} ${styles.clickableCard}`} onClick={navigateToSpecies}>
            <h2>Gestión de Especies</h2>
            <p>Modera y administra las especies registradas</p>
            <span className={styles.cardArrow}>→</span>
          </div>

          <div className={`${styles.card} ${styles.clickableCard}`} onClick={navigateToEcosystems}>
            <h2>Ecosistemas</h2>
            <p>Configura y gestiona los ecosistemas</p>
            <span className={styles.cardArrow}>→</span>
          </div>

          <div className={`${styles.card} ${styles.clickableCard}`} onClick={navigateToSightings}>
            <h2>Gestión de Avistamientos</h2>
            <p>Modera y aprueba los avistamientos reportados</p>
            <span className={styles.cardArrow}>→</span>
          </div>
        </div>
      </main>
    </div>
  );
}

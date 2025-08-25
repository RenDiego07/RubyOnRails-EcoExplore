import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button, Avatar } from '@/components/common';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    navigate('/member/profile');
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>EcoExplore - Explorador</h1>
      <div className={styles.userInfo}>
        <Avatar
          src={user?.profile_photo_url}
          name={user?.name}
          alt={`Foto de perfil de ${user?.name}`}
          size="2.5rem"
          onClick={handleProfileClick}
          className={styles.avatar}
        />
        <div className={styles.userDetails}>
          <span className={styles.welcome}>Bienvenido, {user?.name}</span>
          <span className={styles.points}>{user?.points || 0} puntos</span>
        </div>
        <Button variant="tertiary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
}

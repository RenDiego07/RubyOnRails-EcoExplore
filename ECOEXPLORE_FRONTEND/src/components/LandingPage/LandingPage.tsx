import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { drawScene } from '@/utils/drawScene';
import { Button } from '@/components/common';
import type { LandingPageProps } from '@/types';
import styles from './LandingPage.module.css';

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (canvasRef.current) {
      cleanup = drawScene(canvasRef.current);
    }

    // Cleanup cuando el componente se desmonte
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  const handleLogin = useCallback((): void => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login');
    }
  }, [onLogin, navigate]);

  const handleRegister = useCallback((): void => {
    if (onRegister) {
      onRegister();
    } else {
      navigate('/register');
    }
  }, [onRegister, navigate]);

  return (
    <section className={styles.landingWrap}>
      <canvas
        ref={canvasRef}
        className={styles.landingCanvas}
        aria-hidden="true" // Para accesibilidad, ya que es decorativo
      />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <h2 className={styles.logo}>EcoExplore</h2>
          <nav className={styles.nav}>
            <span className={styles.navItem}>Visitante</span>
            <Button variant="tertiary" size="small" onClick={handleRegister}>
              Entrar / Crear cuenta
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.landingContainer}>
        <div className={styles.content}>
          <h1 className={styles.title}>Bienvenido a EcoExplore</h1>
          <p className={styles.subtitle}>
            Registra, <span className={styles.highlight}>explora</span> y{' '}
            <span className={styles.highlight}>modera</span> especies en ecosistemas de Bosque, Lago
            y Playa.
          </p>
          <div className={styles.actions}>
            <Button variant="primary" size="large" onClick={handleLogin}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;

import type { ModalProps } from './Modal.types';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

export default function Modal({
  title,
  subtitle,
  onClose,
  onConfirm,
  children,
  className = '',
  bodyClassName = '',
  hasActionButtons = false,
  isActionDisabled = false,
  isActionLoading = false,
  confirmButtonText = 'Aceptar',
  cancelButtonText = 'Cancelar',
  size = 'medium',
}: ModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.dialog} ${styles[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </header>

        <div className={`${styles.body} ${bodyClassName}`}>{children}</div>

        {hasActionButtons && (
          <footer className={styles.footer}>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
              {cancelButtonText}
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={onConfirm}
              disabled={isActionDisabled || isActionLoading}
            >
              {isActionLoading ? 'Cargando...' : confirmButtonText}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

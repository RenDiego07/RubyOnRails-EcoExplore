import type { AlertProps } from './Alert.types';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './Alert.module.css';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function Alert({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  const Icon = iconMap[type];

  return (
    <div className={`${styles.alert} ${styles[type]} ${className}`} role="alert">
      <div className={styles.content}>
        <Icon className={styles.icon} size={20} />
        <div className={styles.text}>
          {title && <h4 className={styles.title}>{title}</h4>}
          <p className={styles.message}>{message}</p>
        </div>
      </div>
      {dismissible && onDismiss && (
        <button className={styles.dismissButton} onClick={onDismiss} aria-label="Cerrar alerta">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

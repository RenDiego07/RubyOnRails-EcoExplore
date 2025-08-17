import type { SpinnerProps } from './Spinner.types';
import styles from './Spinner.module.css';

export default function Spinner({
  size = 'medium',
  color = 'primary',
  className = '',
}: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${styles[size]} ${styles[color]} ${className}`}
      role="status"
      aria-label="Cargando"
    >
      <div className={styles.circle}></div>
    </div>
  );
}

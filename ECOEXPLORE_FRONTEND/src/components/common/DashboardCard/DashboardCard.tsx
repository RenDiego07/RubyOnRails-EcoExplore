import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardCard.module.css';

interface DashboardCardProps {
  title: string;
  description: string;
  path?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export default function DashboardCard({
  title,
  description,
  path,
  onClick,
  icon,
}: DashboardCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <div
      className={`${styles.card} ${path || onClick ? styles.clickable : ''}`}
      onClick={handleClick}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

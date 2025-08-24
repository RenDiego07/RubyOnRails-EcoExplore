import { PageHeaderProps } from './PageHeader.types';
import styles from './PageHeader.module.css';

export default function PageHeader({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumbs}>
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={index}>
              {breadcrumb.href ? (
                <a href={breadcrumb.href} className={styles.breadcrumb}>
                  {breadcrumb.label}
                </a>
              ) : (
                <span className={`${styles.breadcrumb} ${styles.current}`}>{breadcrumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className={styles.separator}>/</span>}
            </span>
          ))}
        </nav>
      )}

      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}

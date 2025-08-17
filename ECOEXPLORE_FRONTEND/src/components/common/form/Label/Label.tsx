import React from 'react';
import styles from './Label.module.css';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export default function Label({ children, className, required = false, ...props }: LabelProps) {
  return (
    <label className={`f-semibold ${styles['label']} ${className ?? ''}`} {...props}>
      {children} {required && <span className={styles['label__asterisk']}>*</span>}
    </label>
  );
}

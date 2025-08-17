import { useState, ReactElement, cloneElement, isValidElement, useEffect } from 'react';
import { Label } from '@/components/common/form';

import { FormFieldProps } from './FormField.types';
import styles from './FormField.module.css';

export default function FormField<T extends { onErrorChange?: (err: string | null) => void }>({
  label,
  required,
  children,
  error,
  ...labelProps
}: FormFieldProps & {
  required?: boolean;
  children: ReactElement<T>;
  error?: string;
}) {
  const [internalError, setInternalError] = useState<string | null>(null);

  const displayError = error || internalError;

  useEffect(() => {
    if (error) {
      setInternalError(null);
    }
  }, [error]);

  return (
    <div className={styles['form_field']}>
      {label && (
        <Label required={required} className={styles.label} {...labelProps}>
          {label}
        </Label>
      )}

      {isValidElement(children)
        ? cloneElement(children, { onErrorChange: setInternalError } as Partial<T>)
        : children}

      {displayError && <span className={`${styles.error_message}`}>{displayError}</span>}
    </div>
  );
}

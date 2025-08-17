import React from 'react';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

export default React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { validations = [], onChange = () => {}, onErrorChange = () => {}, className = '', ...props },
  ref
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (validations?.length) {
      const failed = validations.find((rule) => !rule.pattern.test(value));
      const err = failed?.message || null;
      onErrorChange?.(err);
    } else {
      onErrorChange?.(null);
    }
    onChange?.(e);
  };

  return (
    <input
      ref={ref}
      className={`rounded-100 ${styles['input']} ${className}`}
      onChange={handleChange}
      onBlur={props.onBlur}
      name={props.name}
      {...props}
    />
  );
});

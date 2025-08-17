import React from 'react';
import type { TextAreaInputProps } from './TextAreaInput.types';
import styles from './TextAreaInput.module.css';

export default React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>(function TextAreaInput(
  {
    validations = [],
    onChange = () => {},
    onErrorChange = () => {},
    className = '',
    showCharCount = false,
    maxLength,
    value,
    ...props
  },
  ref
) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className={styles.container}>
      <textarea
        ref={ref}
        className={`rounded-100 ${styles['input']} ${className}`}
        onBlur={props.onBlur}
        onChange={handleChange}
        name={props.name}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {showCharCount && maxLength && (
        <div className={styles.charCount}>
          {String(value || '').length}/{maxLength}
        </div>
      )}
    </div>
  );
});

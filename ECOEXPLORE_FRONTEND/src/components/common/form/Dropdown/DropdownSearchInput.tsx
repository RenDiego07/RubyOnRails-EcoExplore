import React from 'react';
import styles from './DropdownSearchInput.module.css';

interface DropdownSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const DropdownSearchInput = React.forwardRef<HTMLInputElement, DropdownSearchInputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        className={`${styles.dropdownSearchInput} ${className}`}
        {...props}
      />
    );
  }
);

DropdownSearchInput.displayName = 'DropdownSearchInput';
export default DropdownSearchInput;

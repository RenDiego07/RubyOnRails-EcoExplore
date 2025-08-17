import { useState, forwardRef } from 'react';
import { Input } from '@/components/common/form';
import { InputProps } from '@/components/common/form/Input';
import { EyeIcon, EyeOffIcon } from '@/icons';
import styles from './PasswordInput.module.css';

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'password', ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={styles.wrapper}>
        <Input {...props} ref={ref} type={visible ? 'text' : type} className={styles.input} />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className={styles.toggle}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

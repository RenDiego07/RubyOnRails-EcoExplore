import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, PasswordInput } from '@/components/common/form';
import { Button } from '@/components/common';
import styles from './LoginForm.module.css';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onCancel?: () => void;
  onSwitchToRegister?: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onCancel,
  onSwitchToRegister,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

  const emailValidations = [
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Ingresa un email válido',
    },
  ];

  const passwordValidations = [
    {
      pattern: /.{6,}/,
      message: 'La contraseña debe tener al menos 6 caracteres',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
      <div className={styles.header}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        <p className={styles.subtitle}>Accede a tu cuenta de EcoExplore</p>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <Input
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresa un email válido',
              },
            })}
            type="email"
            placeholder="Correo electrónico"
            validations={emailValidations}
            className={errors.email ? styles.error : ''}
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
        </div>

        <div className={styles.field}>
          <PasswordInput
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            })}
            placeholder="Contraseña"
            validations={passwordValidations}
            className={errors.password ? styles.error : ''}
          />
          {errors.password && (
            <span className={styles.errorMessage}>{errors.password.message}</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={!isValid || isLoading}
          className={styles.submitButton}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="tertiary"
            size="medium"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancelar
          </Button>
        )}
      </div>

      <div className={styles.footer}>
        <p>
          ¿No tienes cuenta?{' '}
          <span className={styles.link} onClick={onSwitchToRegister}>
            Regístrate aquí
          </span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;

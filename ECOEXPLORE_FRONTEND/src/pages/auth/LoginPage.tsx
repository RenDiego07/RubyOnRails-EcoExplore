import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AuthService, LoginFields } from '@/services/CRUD/auth/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button, Spinner, Alert } from '@/components/common';
import { Input, PasswordInput, FormField, Form } from '@/components/common/form';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { handleToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFields>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const loginData: LoginFields = {
        email: data.email.trim(),
        password: data.password,
      };

      const response = await AuthService.login(loginData);

      if (response?.token && response?.user) {
        console.log('Login exitoso:', response);
        // Guardar token y establecer usuario en AuthProvider
        handleToken(response.token);
        // La navegación se manejará automáticamente cuando el AuthProvider detecte el usuario
      } else {
        setError('Credenciales inválidas');
      }
    } catch {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <p className={styles.subtitle}>Accede a tu cuenta de EcoExplore</p>
        </div>

        {error && <Alert type="error" message={error} dismissible onDismiss={() => setError('')} />}

        <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormField label="Correo electrónico" required error={errors.email?.message}>
            <Input
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresa un email válido',
                },
              })}
              type="email"
              placeholder="tu@email.com"
              validations={emailValidations}
              className={errors.email ? styles.inputError : ''}
            />
          </FormField>

          <FormField label="Contraseña" required error={errors.password?.message}>
            <PasswordInput
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
              placeholder="Tu contraseña"
              validations={passwordValidations}
              className={errors.password ? styles.inputError : ''}
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={!isValid || isLoading}
            className={styles.submitButton}
          >
            {isLoading ? <Spinner size="small" color="white" /> : 'Iniciar Sesión'}
          </Button>
        </Form>

        <div className={styles.footer}>
          <p>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className={styles.link}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

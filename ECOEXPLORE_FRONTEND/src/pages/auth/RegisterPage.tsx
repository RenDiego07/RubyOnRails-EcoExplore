import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthService } from '@/services/CRUD/auth/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Spinner, Alert } from '@/components/common';
import { Input, PasswordInput, FormField, Form } from '@/components/common/form';
import {
  getSuccessMessage,
  getErrorMessage,
  isSuccessResponse,
  extractToken,
} from '@/utils/ResponseHandler';
import styles from './AuthPage.module.css';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setLoading(true);

    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      console.log('🔵 RegisterPage: Enviando datos de registro:', userData);
      const result = await AuthService.register(userData);
      console.log('🔵 RegisterPage: Resultado del registro:', result);

      // Usar las utilidades para manejar la respuesta
      if (isSuccessResponse(result)) {
        // Extraer y guardar token si existe
        const token = extractToken(result);
        if (token) {
          localStorage.setItem('token', token);
          console.log('🟢 RegisterPage: Token guardado en localStorage');
        }
        // Obtener mensaje de éxito
        const successMessage = getSuccessMessage(
          result,
          'Cuenta creada exitosamente. Ahora puedes iniciar sesión.'
        );
        console.log('🟢 RegisterPage: Registro exitoso, navegando a home');
        navigate('/', {
          state: {
            message: successMessage,
          },
        });
      } else {
        // Usar la utilidad para extraer el mensaje de error
        const errorMessage = getErrorMessage(result, 'Error al crear la cuenta');
        console.log('🔴 RegisterPage: Registro falló:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      // Usar la utilidad para manejar errores de conexión y otros errores
      const errorMessage = getErrorMessage(error, 'Error de conexión al servidor');
      console.error('🔴 RegisterPage: Error en registro:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
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
      pattern: /.{8,}/,
      message: 'La contraseña debe tener al menos 8 caracteres',
    },
  ];

  const nameValidations = [
    {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
      message: 'Debe contener al menos 2 caracteres y solo letras',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crear Cuenta</h1>
          <p className={styles.subtitle}>Únete a la comunidad EcoExplore</p>
        </div>

        {error && <Alert type="error" message={error} dismissible onDismiss={() => setError('')} />}

        <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormField label="Nombre completo" required error={errors.name?.message}>
            <Input
              {...register('name', {
                required: 'El nombre es requerido',
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
                  message: 'Debe contener al menos 2 caracteres y solo letras',
                },
              })}
              type="text"
              placeholder="Tu nombre completo"
              validations={nameValidations}
              className={errors.name ? styles.inputError : ''}
            />
          </FormField>

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
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
              })}
              placeholder="Tu contraseña"
              validations={passwordValidations}
              className={errors.password ? styles.inputError : ''}
            />
          </FormField>

          <FormField label="Confirmar contraseña" required error={errors.confirmPassword?.message}>
            <PasswordInput
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: (value) => value === password || 'Las contraseñas no coinciden',
              })}
              placeholder="Confirma tu contraseña"
              className={errors.confirmPassword ? styles.inputError : ''}
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={!isValid || loading}
            className={styles.submitButton}
          >
            {loading ? <Spinner size="small" color="white" /> : 'Crear Cuenta'}
          </Button>
        </Form>

        <div className={styles.footer}>
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className={styles.link}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Form, FormField, Input, PasswordInput } from '@/components/common/form';
import { Button, Avatar, Alert } from '@/components/common';
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload';
import { UserService } from '@/services/CRUD/users/users.service';
import styles from './UserProfilePage.module.css';

interface ProfileFormData {
  name: string;
  email: string;
  profile_photo_url: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface ProfileUpdateData {
  name: string;
  email: string;
  current_password?: string;
  new_password?: string;
}

const getProfilePhotoUrl = (user: unknown): string => {
  return (user as { profile_photo_url?: string })?.profile_photo_url || '';
};

export default function UserProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    profile_photo_url: getProfilePhotoUrl(user),
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profile_photo_url: getProfilePhotoUrl(user),
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.current_password || formData.new_password || formData.confirm_password) {
      if (!formData.current_password.trim()) {
        newErrors.current_password = 'La contraseña actual es requerida';
      }

      if (!formData.new_password.trim()) {
        newErrors.new_password = 'La nueva contraseña es requerida';
      } else if (formData.new_password.length < 6) {
        newErrors.new_password = 'La nueva contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirm_password.trim()) {
        newErrors.confirm_password = 'Confirmar la contraseña es requerido';
      } else if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const updateData: ProfileUpdateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.current_password || formData.new_password || formData.confirm_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }

      const updatedUser = await UserService.updateProfile(updateData);

      if (updateUser) {
        updateUser(updatedUser);
      }

      setFormData((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));

      setIsEditing(false);
      showToast(
        (close) => <Alert message="Perfil actualizado exitosamente" onDismiss={close} />,
        4000
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(
        (close) => <Alert message="Error al actualizar el perfil" onDismiss={close} />,
        6000
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      profile_photo_url: getProfilePhotoUrl(user),
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePhotoChange = (photoUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      profile_photo_url: photoUrl,
    }));
    if (updateUser) {
      updateUser({ profile_photo_url: photoUrl });
    }
  };

  const getFullName = () => {
    return formData.name || user?.name || 'Usuario';
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Mi Perfil</h1>
          <p className={styles.subtitle}>Gestiona tu información personal</p>
        </div>

        <div className={styles.actionButtons}>
          <Button variant="tertiary" onClick={handleBack}>
            ← Volver
          </Button>

          {!isEditing ? (
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Editar Perfil
            </Button>
          ) : (
            <>
              <Button variant="tertiary" onClick={handleCancel} className={styles.cancelButton}>
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      <section className={styles.content}>
        <div className={styles.photoSection}>
          <header className={styles.formHeader}>
            <h6 className={styles.sectionTitle}>Foto de Perfil</h6>
            <div className={styles.separator} />
          </header>

          <div className={styles.currentPhoto}>
            <Avatar
              src={formData.profile_photo_url || undefined}
              name={getFullName()}
              alt="Foto de perfil"
              size="6rem"
            />
          </div>

          {isEditing && (
            <ProfilePhotoUpload
              currentPhoto={formData.profile_photo_url || undefined}
              disabled={!isEditing}
              onPhotoChange={handlePhotoChange}
            />
          )}
        </div>

        <div className={styles.profileForm}>
          <header className={styles.formHeader}>
            <h6 className={styles.sectionTitle}>Información Personal</h6>
            <div className={styles.separator} />
          </header>

          <Form onSubmit={handleSubmit} className={styles.formSection}>
            <div className={styles.formRow}>
              <FormField label="Nombre Completo" required error={errors.name}>
                <Input
                  type="text"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  disabled={!isEditing || isLoading}
                />
              </FormField>

              <FormField label="Correo Electrónico" required error={errors.email}>
                <Input
                  type="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  disabled={!isEditing || isLoading}
                />
              </FormField>
            </div>

            <div className={styles.formRow}>
              <FormField label="Contraseña Actual" error={errors.current_password}>
                <PasswordInput
                  className={styles.input}
                  value={formData.current_password}
                  onChange={(e) => handleInputChange('current_password', e.target.value)}
                  placeholder="Contraseña actual"
                  disabled={!isEditing || isLoading}
                />
              </FormField>

              <FormField label="Nueva Contraseña" error={errors.new_password}>
                <PasswordInput
                  className={styles.input}
                  value={formData.new_password}
                  onChange={(e) => handleInputChange('new_password', e.target.value)}
                  placeholder="Nueva contraseña"
                  disabled={!isEditing || isLoading}
                />
              </FormField>
            </div>

            <div className={styles.formRow}>
              <FormField label="Confirmar Contraseña" error={errors.confirm_password}>
                <PasswordInput
                  className={styles.input}
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  placeholder="Confirmar nueva contraseña"
                  disabled={!isEditing || isLoading}
                />
              </FormField>

              <FormField label="Puntos">
                <Input
                  type="number"
                  className={styles.input}
                  value={String(user?.points || 0)}
                  disabled
                  placeholder="Puntos acumulados"
                  readOnly
                />
              </FormField>
            </div>

            {isEditing && (
              <div className={styles.formActions}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className={styles.saveButton}
                >
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            )}
          </Form>

          <header className={styles.formHeader}>
            <h6 className={styles.sectionTitle}>Información del Sistema</h6>
            <div className={styles.separator} />
          </header>

          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <FormField label="Usuario desde">
                <Input
                  type="text"
                  className={styles.input}
                  value={
                    user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('es-ES')
                      : 'Información no disponible'
                  }
                  disabled
                  placeholder="Fecha de registro"
                  readOnly
                />
              </FormField>

              <FormField label="Última actualización">
                <Input
                  type="text"
                  className={styles.input}
                  value={
                    user?.updated_at
                      ? new Date(user.updated_at).toLocaleDateString('es-ES')
                      : 'Información no disponible'
                  }
                  disabled
                  placeholder="Última modificación"
                  readOnly
                />
              </FormField>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

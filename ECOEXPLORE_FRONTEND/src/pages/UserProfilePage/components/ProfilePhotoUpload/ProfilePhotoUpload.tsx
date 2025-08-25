import { useState, useRef } from 'react';
import { Button, Alert } from '@/components/common';
import { useToast } from '@/hooks/useToast';
import { UserService } from '@/services/CRUD/users/users.service';
import FirebaseService from '@/services/firebase/firebase.service';
import styles from './ProfilePhotoUpload.module.css';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  disabled?: boolean;
  onPhotoChange: (photoUrl: string) => void;
}

export default function ProfilePhotoUpload({
  currentPhoto,
  disabled = false,
  onPhotoChange,
}: ProfilePhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar archivo usando FirebaseService
    const validation = FirebaseService.validateImageFile(file);
    if (!validation.isValid) {
      showToast(
        (close) => <Alert message={validation.error || 'Archivo no válido'} onDismiss={close} />,
        4000
      );
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewUrl || !fileInputRef.current?.files?.[0]) return;

    try {
      setIsUploading(true);
      const file = fileInputRef.current.files[0];

      // Subir usando el servicio de usuarios que incluye Firebase
      const result = await UserService.uploadAndUpdateProfilePhoto(file);
      // Call the callback to update parent component
      onPhotoChange(result.profile_photo_url || '');

      setHasChanges(false);
      setPreviewUrl('');

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      showToast(
        (close) => <Alert message="Foto de perfil actualizada exitosamente" onDismiss={close} />,
        4000
      );
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      showToast(
        (close) => (
          <Alert message="Error al subir la foto. Intenta nuevamente." onDismiss={close} />
        ),
        6000
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl('');
    setHasChanges(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async () => {
    if (!currentPhoto) return;

    try {
      setIsUploading(true);
      // Usar el servicio para eliminar la foto
      await UserService.removeProfilePhoto(currentPhoto);
      onPhotoChange('');

      showToast(
        (close) => <Alert message="Foto de perfil eliminada exitosamente" onDismiss={close} />,
        4000
      );
    } catch (error) {
      console.error('Error removing profile photo:', error);
      showToast(
        (close) => (
          <Alert message="Error al eliminar la foto. Intenta nuevamente." onDismiss={close} />
        ),
        6000
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectPhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.photoPreview}>
        {previewUrl && <img src={previewUrl} alt="Vista previa" className={styles.previewImage} />}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <div className={styles.actions}>
        {!hasChanges ? (
          <>
            <Button
              variant="secondary"
              onClick={handleSelectPhoto}
              disabled={disabled || isUploading}
              className={styles.selectButton}
            >
              📷 {currentPhoto ? 'Cambiar Foto' : 'Subir Foto'}
            </Button>

            {currentPhoto && (
              <Button
                variant="tertiary"
                onClick={handleDeletePhoto}
                disabled={disabled || isUploading}
                className={styles.deleteButton}
              >
                🗑️ {isUploading ? 'Eliminando...' : 'Eliminar Foto'}
              </Button>
            )}
          </>
        ) : (
          <div className={styles.actionGroup}>
            <Button
              variant="tertiary"
              onClick={handleCancel}
              disabled={isUploading}
              className={styles.cancelButton}
            >
              ❌ Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={isUploading}
              className={styles.uploadButton}
            >
              ⬆️ {isUploading ? 'Subiendo...' : 'Subir'}
            </Button>
          </div>
        )}
      </div>

      <p className={styles.helpText}>Formatos permitidos: JPEG, PNG, WEBP. Máximo 5MB.</p>
    </div>
  );
}

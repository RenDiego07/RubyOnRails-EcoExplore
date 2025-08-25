import { useState, useRef } from 'react';
import { Button } from '@/components/common';
import FirebaseService from '@/services/firebase/firebase.service';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string | null;
  disabled?: boolean;
  className?: string;
}

export default function ImageUploader({
  onImageUploaded,
  currentImage,
  disabled = false,
  className = '',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar archivo
    const validation = FirebaseService.validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Archivo no válido');
      return;
    }

    try {
      setIsUploading(true);

      // Crear preview local
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Redimensionar imagen si es muy grande
      const resizedFile = await FirebaseService.resizeImage(file, 1200, 800, 0.8);

      // Subir a Firebase
      const downloadURL = await FirebaseService.uploadImage(resizedFile);

      // Limpiar preview local
      URL.revokeObjectURL(localPreview);

      // Actualizar con la URL real
      setPreviewUrl(downloadURL);
      onImageUploaded(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Error al subir la imagen');
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (previewUrl && previewUrl !== currentImage) {
      try {
        await FirebaseService.deleteImage(previewUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setPreviewUrl(null);
    onImageUploaded('');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${styles.imageUploader} ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className={styles.hiddenInput}
      />

      {previewUrl ? (
        <div className={styles.imagePreview}>
          <img src={previewUrl} alt="Preview" className={styles.previewImage} />
          <div className={styles.imageActions}>
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={handleButtonClick}
              disabled={disabled || isUploading}
            >
              {isUploading ? 'Subiendo...' : 'Cambiar imagen'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="small"
              onClick={handleRemoveImage}
              disabled={disabled || isUploading}
            >
              Eliminar
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.uploadPlaceholder}>
          <div className={styles.uploadIcon}>📸</div>
          <p className={styles.uploadText}>
            {isUploading ? 'Subiendo imagen...' : 'Agregar imagen del avistamiento'}
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={handleButtonClick}
            disabled={disabled || isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Seleccionar imagen'}
          </Button>
        </div>
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      <p className={styles.helpText}>Formatos permitidos: JPEG, PNG, WEBP. Tamaño máximo: 5MB</p>
    </div>
  );
}

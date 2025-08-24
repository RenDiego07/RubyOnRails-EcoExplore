import { useState } from 'react';
import Modal from '@/components/common/Modals/Modal/Modal';
import type { DisplayPictureModalProps } from './DisplayPictureModal.types';
import styles from './DisplayPictureModal.module.css';

export default function DisplayPictureModal({
  isOpen,
  onClose,
  imageUrl,
  imageAlt = 'Imagen',
  title = 'Imagen del Avistamiento',
  subtitle,
}: DisplayPictureModalProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!isOpen) return null;

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  const renderContent = () => {
    if (imageError) {
      return (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>🖼️</div>
          <p className={styles.errorText}>
            No se pudo cargar la imagen.
            <br />
            Verifica tu conexión a internet e inténtalo de nuevo.
          </p>
        </div>
      );
    }

    return (
      <div className={styles.imageContainer}>
        {isImageLoading && (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}>⏳</div>
            <p>Cargando imagen...</p>
          </div>
        )}
        <img
          src={imageUrl}
          alt={imageAlt}
          className={styles.image}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            display: isImageLoading ? 'none' : 'block',
          }}
        />
      </div>
    );
  };

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      hasActionButtons={false}
      size="large"
      className={styles.displayPictureModal}
    >
      <div className={styles.modalContent}>{renderContent()}</div>
    </Modal>
  );
}

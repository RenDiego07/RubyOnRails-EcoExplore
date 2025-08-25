import React from 'react';
import Modal from '../Modal';
import { SightingDetailModalProps } from './SightingDetailModal.types';
import styles from './SightingDetailModal.module.css';

export const SightingDetailModal: React.FC<SightingDetailModalProps> = ({
  sighting,
  isOpen,
  onClose,
  onApprove,
  onReject,
  loading = false
}) => {
  if (!sighting || !isOpen) return null;

  const getStateBadgeClass = (stateName: string) => {
    switch (stateName.toLowerCase()) {
      case 'pending':
        return styles.pending;
      case 'accepted':
        return styles.approved;
      case 'rejected':
        return styles.rejected;
      default:
        return styles.pending;
    }
  };

  const isPending = sighting.sighting_state_name?.toLowerCase() === 'pending';
  const isApproved = sighting.sighting_state_name?.toLowerCase() === 'accepted';
  const isRejected = sighting.sighting_state_name?.toLowerCase() === 'rejected';

  return (
    <Modal
      title="Detalle del Avistamiento"
      subtitle={`Reportado por ${sighting.user_name} el ${new Date(sighting.created_at).toLocaleDateString('es-ES')}`}
      onClose={onClose}
      hasActionButtons={false}
      size="large"
      className={styles.modal}
    >
      <div className={styles.statusInfo}>
        <p className={styles.statusText}>
          📋 Revisa toda la información del avistamiento antes de tomar una decisión
        </p>
      </div>

      <div className={styles.sightingInfo}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Usuario</span>
            <span className={styles.infoValue}>{sighting.user_name}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{sighting.user_email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Especie</span>
            <span className={styles.infoValue}>{sighting.specie || 'No especificada'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ecosistema</span>
            <span className={styles.infoValue}>{sighting.ecosystem_name}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ubicación</span>
            <span className={styles.infoValue}>{sighting.location_name}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Estado Actual</span>
            <span 
              className={`${styles.stateBadge} ${getStateBadgeClass(sighting.sighting_state_name || '')}`}
            >
              {sighting.sighting_state_name}
            </span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de Reporte</span>
            <span className={styles.infoValue}>
              {new Date(sighting.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Hora</span>
            <span className={styles.infoValue}>
              {new Date(sighting.created_at).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {sighting.description && (
            <div className={`${styles.infoItem} ${styles.description}`}>
              <span className={styles.infoLabel}>Descripción</span>
              <p className={styles.descriptionText}>{sighting.description}</p>
            </div>
          )}
        </div>

        {sighting.image_path && (
          <div className={styles.imageContainer}>
            <img 
              src={sighting.image_path} 
              alt={`Avistamiento de ${sighting.specie}`}
              className={styles.sightingImage}
            />
          </div>
        )}

        {!sighting.image_path && (
          <div className={styles.noImage}>
            📷 Sin imagen disponible
          </div>
        )}

        {isPending && (
          <div className={styles.actions}>
            <button
              className={`${styles.actionButton} ${styles.approveButton}`}
              onClick={() => {
                onApprove(sighting.id);
                onClose();
              }}
              disabled={loading}
            >
              {loading ? 'Aprobando...' : 'Aprobar Avistamiento'}
            </button>
            <button
              className={`${styles.actionButton} ${styles.rejectButton}`}
              onClick={() =>  {
                onReject(sighting.id);
                onClose();
              }}
              disabled={loading}
            >
              {loading ? 'Rechazando...' : 'Rechazar Avistamiento'}
            </button>
          </div>
        )}

        {(isApproved || isRejected) && (
          <div className={styles.statusInfo}>
            <p className={styles.statusText}>
              {isApproved ? 'Este avistamiento ya ha sido aprobado' : 'Este avistamiento ha sido rechazado'}
            </p>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          disabled={loading}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

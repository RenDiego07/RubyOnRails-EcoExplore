import { Modal } from '@/components/common';
import styles from './MapModal.module.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: {
    lat: number;
    lng: number;
  };
  title?: string;
  description?: string;
}

export default function MapModal({
  isOpen,
  onClose,
  coordinates,
  title = 'Ubicación',
  description,
}: MapModalProps) {
  if (!isOpen) return null;

  const { lat, lng } = coordinates;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <Modal title={title} onClose={onClose} size="large">
      <div className={styles.mapContainer}>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.coordinatesInfo}>
          <strong>Coordenadas:</strong> {lat.toFixed(6)}, {lng.toFixed(6)}
        </div>
        <div className={styles.mapWrapper}>
          <iframe
            src={osmUrl}
            className={styles.mapFrame}
            title={title}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className={styles.mapActions}>
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openInMapsLink}
          >
            Abrir en Google Maps
          </a>
        </div>
      </div>
    </Modal>
  );
}

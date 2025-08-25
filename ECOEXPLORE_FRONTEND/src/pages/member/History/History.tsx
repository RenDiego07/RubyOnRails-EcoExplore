import { useState } from 'react';
import { Button, Table } from '@/components/common';
import DisplayPictureModal from '@/components/common/Modals/DisplayPictureModal';
import MapModal from '@/components/common/MapModal';
import { useUserSightings } from '@/hooks/useUserSightings';
import { useContributedSpecies } from '@/hooks/useContributedSpecies';
import { transformSightingsToHistory, type HistorySighting } from '@/utils/sightingTransformers';
import type { ContributedSpeciesData } from '@/interfaces';
import styles from './History.module.css';

type HistoryView = 'sightings' | 'species';

export default function History() {
  const [currentView, setCurrentView] = useState<HistoryView>('sightings');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mapModal, setMapModal] = useState<{
    isOpen: boolean;
    coordinates: { lat: number; lng: number };
    title: string;
    description?: string;
  }>({
    isOpen: false,
    coordinates: { lat: 0, lng: 0 },
    title: '',
  });

  // Obtener sightings reales del usuario
  const {
    sightings: rawSightings,
    loading: sightingsLoading,
    error: sightingsError,
  } = useUserSightings();

  // Obtener especies contribuidas reales del usuario
  const {
    species: contributedSpecies,
    loading: speciesLoading,
    error: speciesError,
  } = useContributedSpecies();

  // Transformar los datos de Sighting al formato esperado por el componente
  const userSightings: HistorySighting[] = transformSightingsToHistory(rawSightings);

  const handleShowMap = (
    coordinates: { lat: number; lng: number },
    title: string,
    description?: string
  ) => {
    setMapModal({
      isOpen: true,
      coordinates,
      title,
      description,
    });
  };

  const handleShowImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const sightingsColumns = [
    { key: 'species_name', label: 'Especie', sortable: true },
    {
      key: 'location',
      label: 'Ubicación',
      sortable: true,
      render: (value: unknown, row: HistorySighting) => (
        <div className={styles.locationCell}>
          <span>{value as string}</span>
          <Button
            variant="tertiary"
            size="small"
            onClick={() =>
              handleShowMap(
                row.coordinates,
                `${row.species_name} - ${row.location}`,
                row.description
              )
            }
          >
            🗺️ Ver mapa
          </Button>
        </div>
      ),
    },
    { key: 'description', label: 'Descripción', sortable: false },
    {
      key: 'date',
      label: 'Fecha',
      sortable: true,
      render: (value: unknown) => new Date(value as string).toLocaleDateString('es-ES'),
    },
    {
      key: 'image_url',
      label: 'Imagen',
      sortable: false,
      render: (value: unknown) => {
        if (value) {
          return (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleShowImage(value as string)}
            >
              🖼️ Ver imagen
            </Button>
          );
        }
        return <span className={styles.noImage}>Sin imagen</span>;
      },
    },
  ];

  const speciesColumns = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', sortable: false },
    {
      key: 'location',
      label: 'Ubicación',
      sortable: true,
      render: (value: unknown, row: ContributedSpeciesData) => (
        <div className={styles.locationCell}>
          <span>{value as string}</span>
          <Button
            variant="tertiary"
            size="small"
            onClick={() =>
              handleShowMap(row.coordinates, `${row.name} - ${row.location}`, row.description)
            }
          >
            🗺️ Ver mapa
          </Button>
        </div>
      ),
    },
    {
      key: 'image_url',
      label: 'Imagen',
      sortable: false,
      render: (value: unknown) => {
        if (value) {
          return (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleShowImage(value as string)}
            >
              🖼️ Ver imagen
            </Button>
          );
        }
        return <span className={styles.noImage}>Sin imagen</span>;
      },
    },
  ];

  return (
    <div className={styles.historyContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mi Historial</h1>
        <p className={styles.subtitle}>
          Revisa tus avistamientos y las especies que has ayudado a documentar
        </p>
      </header>

      <div className={styles.viewToggle}>
        <Button
          variant={currentView === 'sightings' ? 'primary' : 'secondary'}
          onClick={() => setCurrentView('sightings')}
          className={styles.toggleButton}
        >
          📋 Mis Avistamientos ({userSightings.length})
        </Button>
        <Button
          variant={currentView === 'species' ? 'primary' : 'secondary'}
          onClick={() => setCurrentView('species')}
          className={styles.toggleButton}
        >
          🦋 Especies Contribuidas ({contributedSpecies.length})
        </Button>
      </div>

      {/* Mostrar error si hay alguno */}
      {(sightingsError || speciesError) && (
        <div className={styles.errorMessage}>
          <p>
            Error al cargar los datos: {currentView === 'sightings' ? sightingsError : speciesError}
          </p>
        </div>
      )}

      <div className={styles.tableContainer}>
        {currentView === 'sightings' ? (
          <Table
            data={userSightings}
            columns={sightingsColumns}
            emptyMessage="No has registrado ningún avistamiento aún"
            loading={sightingsLoading}
          />
        ) : (
          <Table
            data={contributedSpecies}
            columns={speciesColumns}
            emptyMessage="No has contribuido a encontrar ninguna especie aún"
            loading={speciesLoading}
          />
        )}
      </div>

      {/* Modal para mostrar imágenes */}
      <DisplayPictureModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />

      {/* Modal para mostrar mapa */}
      <MapModal
        isOpen={mapModal.isOpen}
        onClose={() => setMapModal((prev) => ({ ...prev, isOpen: false }))}
        coordinates={mapModal.coordinates}
        title={mapModal.title}
        description={mapModal.description}
      />
    </div>
  );
}

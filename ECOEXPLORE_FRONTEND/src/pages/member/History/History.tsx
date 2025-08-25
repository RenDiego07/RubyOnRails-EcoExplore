import { useState } from 'react';
import { Button, Table } from '@/components/common';
import DisplayPictureModal from '@/components/common/Modals/DisplayPictureModal';
import MapModal from '@/components/common/MapModal';
import styles from './History.module.css';

interface Sighting {
  id: string;
  species_name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  date: string;
  image_url?: string;
}

interface Species {
  id: string;
  name: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  image_url: string;
}

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

  // Mock data para sightings del usuario
  const mockSightings: Sighting[] = [
    {
      id: '1',
      species_name: 'Águila Real',
      location: 'Parque Nacional Yellowstone',
      coordinates: { lat: 44.9778, lng: -110.6968 },
      description: 'Avistada cerca del lago durante el amanecer. Comportamiento de caza observado.',
      date: '2024-08-20',
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
    },
    {
      id: '2',
      species_name: 'Lobo Gris',
      location: 'Bosque Nacional de Alaska',
      coordinates: { lat: 64.0685, lng: -152.2782 },
      description: 'Manada de 5 individuos observada durante migración.',
      date: '2024-08-18',
      image_url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500',
    },
    {
      id: '3',
      species_name: 'Oso Pardo',
      location: 'Montañas Rocosas',
      coordinates: { lat: 39.7392, lng: -104.9903 },
      description: 'Ejemplar adulto pescando salmón en el río.',
      date: '2024-08-15',
      image_url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=500',
    },
  ];

  // Mock data para especies encontradas por el usuario
  const mockSpecies: Species[] = [
    {
      id: '1',
      name: 'Mariposa Monarca',
      description: 'Especie migratoria conocida por sus viajes de larga distancia.',
      location: 'Reserva de la Biosfera Mariposa Monarca',
      coordinates: { lat: 19.5943, lng: -100.2442 },
      image_url: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=500',
    },
    {
      id: '2',
      name: 'Jaguar',
      description: 'Felino más grande de América, especie en peligro de extinción.',
      location: 'Selva Lacandona, Chiapas',
      coordinates: { lat: 16.8563, lng: -91.5549 },
      image_url: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=500',
    },
    {
      id: '3',
      name: 'Quetzal Resplandeciente',
      description: 'Ave sagrada de las culturas mesoamericanas.',
      location: 'Bosque de Niebla, Guatemala',
      coordinates: { lat: 14.6349, lng: -90.5069 },
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    },
  ];

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
      render: (value: unknown, row: Sighting) => (
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
      render: (value: unknown, row: Species) => (
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
      render: (value: unknown) => (
        <Button variant="secondary" size="small" onClick={() => handleShowImage(value as string)}>
          🖼️ Ver imagen
        </Button>
      ),
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
          📋 Mis Avistamientos ({mockSightings.length})
        </Button>
        <Button
          variant={currentView === 'species' ? 'primary' : 'secondary'}
          onClick={() => setCurrentView('species')}
          className={styles.toggleButton}
        >
          🦋 Especies Contribuidas ({mockSpecies.length})
        </Button>
      </div>

      <div className={styles.tableContainer}>
        {currentView === 'sightings' ? (
          <Table
            data={mockSightings}
            columns={sightingsColumns}
            emptyMessage="No has registrado ningún avistamiento aún"
          />
        ) : (
          <Table
            data={mockSpecies}
            columns={speciesColumns}
            emptyMessage="No has contribuido a encontrar ninguna especie aún"
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

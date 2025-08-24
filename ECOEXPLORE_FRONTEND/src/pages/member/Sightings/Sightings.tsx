import { useState, useEffect } from 'react';
import { Button, Alert } from '@/components/common';
import { Form, FormField, Input, TextAreaInput, Selector } from '@/components/common/form';
import ImageUploader from '@/components/common/ImageUploader';
import DisplayPictureModal from '@/components/common/Modals/DisplayPictureModal';
import { createSighting, getSightings } from '@/services/CRUD/sightings/POST/sightingsPost';
import { CRUDEcosystems, Ecosystem } from '@/services/CRUD/ecosystems';
import type { SelectorOption } from '@/components/common/form/Selector/Selector.types';
import styles from './Sightings.module.css';

interface SightingData {
  ecosystem_id: number | null;
  description: string;
  location_name: string;
  coordinates: string;
  image_path: string;
  specie: string;
}

interface Sighting {
  id: number;
  description: string;
  sighting_location: string;
  sighting_location_coordinates?: string;
  sighting_state_name: string;
  image_path?: string;
  specie?: string;
  created_at: string;
}

interface AxiosError {
  response?: {
    data?: {
      error?: string;
      errors?: string[];
    };
  };
}

const initialFormData: SightingData = {
  ecosystem_id: null,
  description: '',
  location_name: '',
  coordinates: '',
  image_path: '',
  specie: '',
};

export default function Sightings() {
  const [formData, setFormData] = useState<SightingData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [isLoadingEcosystems, setIsLoadingEcosystems] = useState(true);
  const [selectedEcosystem, setSelectedEcosystem] = useState<SelectorOption | null>(null);

  // Estados para el modal de imagen
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  useEffect(() => {
    fetchSightings();
    fetchEcosystems();
  }, []);

  const fetchEcosystems = async () => {
    try {
      setIsLoadingEcosystems(true);
      const data = await CRUDEcosystems.getAll();
      setEcosystems(data);
    } catch (error) {
      console.error('Error fetching ecosystems:', error);
      setAlert({ type: 'error', message: 'Error al cargar los ecosistemas' });
    } finally {
      setIsLoadingEcosystems(false);
    }
  };

  const fetchSightings = async () => {
    try {
      const data = await getSightings();
      setSightings(data);
    } catch (error) {
      console.error('Error fetching sightings:', error);
    }
  };

  const handleInputChange = (field: keyof SightingData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image_path: imageUrl,
    }));
  };

  const handleEcosystemSelect = (option: SelectorOption | SelectorOption[] | null) => {
    // Si es un array, tomar solo el primer elemento (para selectores múltiples)
    const selectedOption = Array.isArray(option) ? option[0] || null : option;

    setSelectedEcosystem(selectedOption);
    setFormData((prev) => ({
      ...prev,
      ecosystem_id: selectedOption ? Number(selectedOption.value) : null,
    }));
  };

  // Funciones para manejar el modal de imagen
  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.ecosystem_id ||
      !formData.description ||
      !formData.location_name ||
      !formData.specie
    ) {
      setAlert({ type: 'error', message: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      await createSighting({
        ecosystem_id: formData.ecosystem_id!,
        description: formData.description,
        location_name: formData.location_name,
        coordinates: formData.coordinates || undefined,
        image_path: formData.image_path || undefined,
        specie: formData.specie,
      });

      setAlert({ type: 'success', message: 'Avistamiento registrado exitosamente' });
      setFormData(initialFormData);
      setSelectedEcosystem(null);
      await fetchSightings();
    } catch (error: unknown) {
      console.error('Error creating sighting:', error);
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as AxiosError).response?.data?.error ||
            (error as AxiosError).response?.data?.errors?.join(', ') ||
            'Error al registrar el avistamiento'
          : 'Error al registrar el avistamiento';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Convertir ecosistemas a opciones del selector
  const ecosystemOptions: SelectorOption[] = ecosystems.map((ecosystem) => ({
    label: ecosystem.name,
    value: ecosystem.id,
    description: ecosystem.description,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Mis Avistamientos</h1>
        <p>Registra nuevos avistamientos de especies y revisa tu historial</p>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h2>Registrar Nuevo Avistamiento</h2>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              dismissible
              onDismiss={() => setAlert(null)}
            />
          )}

          <Form onSubmit={handleSubmit}>
            <FormField label="Ecosistema" required>
              <Selector
                value={selectedEcosystem}
                options={ecosystemOptions}
                onSelect={handleEcosystemSelect}
                placeholder="Selecciona un ecosistema"
                searchable
                isLoading={isLoadingEcosystems}
                disabled={isLoading}
                required
              />
            </FormField>

            <FormField label="Nombre de la Ubicación" required>
              <Input
                id="location_name"
                type="text"
                value={formData.location_name}
                onChange={(e) => handleInputChange('location_name', e.target.value)}
                placeholder="Ej: Parque Nacional "
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Coordenadas (Opcional)">
              <Input
                id="coordinates"
                type="text"
                value={formData.coordinates}
                onChange={(e) => handleInputChange('coordinates', e.target.value)}
                placeholder="Ej: -0.6753, -76.3942"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Especie" required>
              <Input
                id="specie"
                type="text"
                value={formData.specie}
                onChange={(e) => handleInputChange('specie', e.target.value)}
                placeholder="Ej: Iguana"
                disabled={isLoading}
                maxLength={50}
              />
            </FormField>

            <FormField label="Descripción" required>
              <TextAreaInput
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe lo que observaste..."
                rows={4}
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Imagen del Avistamiento">
              <ImageUploader
                onImageUploaded={handleImageUploaded}
                currentImage={formData.image_path}
                disabled={isLoading}
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Registrando...' : 'Registrar Avistamiento'}
            </Button>
          </Form>
        </div>

        <div className={styles.historySection}>
          <h2>Historial de Avistamientos</h2>

          {sightings.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Aún no tienes avistamientos registrados</p>
            </div>
          ) : (
            <div className={styles.sightingsList}>
              {sightings.map((sighting) => (
                <div key={sighting.id} className={styles.sightingCard}>
                  {sighting.image_path && (
                    <div className={styles.sightingImage}>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleImageClick(sighting.image_path!)}
                      >
                        Ver Imagen
                      </Button>
                    </div>
                  )}
                  <div className={styles.sightingContent}>
                    <div className={styles.sightingHeader}>
                      <span className={styles.date}>
                        {new Date(sighting.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p>
                      <strong>Ubicación:</strong> {sighting.sighting_location}
                    </p>
                    <p>
                      <strong>Estado:</strong> {sighting.sighting_state_name}
                    </p>
                    {sighting.specie && (
                      <p>
                        <strong>Especie:</strong> {sighting.specie}
                      </p>
                    )}
                    <p>
                      <strong>Descripción:</strong> {sighting.description}
                    </p>
                    {sighting.sighting_location_coordinates && (
                      <p>
                        <strong>Coordenadas:</strong> {sighting.sighting_location_coordinates}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para mostrar imagen */}
      <DisplayPictureModal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        imageUrl={selectedImageUrl}
        imageAlt="Imagen del avistamiento"
        title="Imagen del Avistamiento"
      />
    </div>
  );
}

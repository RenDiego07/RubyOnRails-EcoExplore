import { useState, useEffect } from 'react';
import { Button, Alert } from '@/components/common';
import { Form, FormField, Input, Label, TextAreaInput, Selector } from '@/components/common/form';
import { createSighting, getSightings } from '@/services/CRUD/sightings/POST/sightingsPost';
import { CRUDEcosystems, Ecosystem } from '@/services/CRUD/ecosystems';
import type { SelectorOption } from '@/components/common/form/Selector/Selector.types';
import styles from './Sightings.module.css';

interface SightingData {
  ecosystem_id: number | null;
  description: string;
  location_name: string;
  coordinates: string;
}

interface Sighting {
  id: number;
  description: string;
  sighting_location: string;
  sighting_location_coordinates?: string;
  sighting_state_name: string;
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
};

export default function Sightings() {
  const [formData, setFormData] = useState<SightingData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [isLoadingEcosystems, setIsLoadingEcosystems] = useState(true);
  const [selectedEcosystem, setSelectedEcosystem] = useState<SelectorOption | null>(null);

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

  const handleEcosystemSelect = (option: SelectorOption | null) => {
    setSelectedEcosystem(option);
    setFormData((prev) => ({
      ...prev,
      ecosystem_id: option ? Number(option.value) : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ecosystem_id || !formData.description || !formData.location_name) {
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
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          )}

          <Form onSubmit={handleSubmit}>
            <FormField>
              <Label htmlFor="ecosystem_id">Ecosistema *</Label>
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

            <FormField>
              <Label htmlFor="location_name">Nombre de la Ubicación *</Label>
              <Input
                id="location_name"
                type="text"
                value={formData.location_name}
                onChange={(e) => handleInputChange('location_name', e.target.value)}
                placeholder="Ej: Parque Nacional Yasuní"
                disabled={isLoading}
              />
            </FormField>

            <FormField>
              <Label htmlFor="coordinates">Coordenadas (Opcional)</Label>
              <Input
                id="coordinates"
                type="text"
                value={formData.coordinates}
                onChange={(e) => handleInputChange('coordinates', e.target.value)}
                placeholder="Ej: -0.6753, -76.3942"
                disabled={isLoading}
              />
            </FormField>

            <FormField>
              <Label htmlFor="description">Descripción *</Label>
              <TextAreaInput
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe lo que observaste..."
                rows={4}
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
                  <p>
                    <strong>Descripción:</strong> {sighting.description}
                  </p>
                  {sighting.sighting_location_coordinates && (
                    <p>
                      <strong>Coordenadas:</strong> {sighting.sighting_location_coordinates}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

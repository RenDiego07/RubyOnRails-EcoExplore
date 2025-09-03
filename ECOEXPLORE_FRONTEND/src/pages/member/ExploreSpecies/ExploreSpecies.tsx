import { useState, useEffect } from 'react';
import { Button, Table, Filters } from '@/components/common';
import DisplayPictureModal from '@/components/common/Modals/DisplayPictureModal';
import MapModal from '@/components/common/MapModal';
import { getExploreSpecies } from '@/services/CRUD/userSpecies/GET/userSpeciesGet';
import { CRUDEcosystems, type Ecosystem } from '@/services/CRUD/ecosystems';
import type { ContributedSpeciesResponse, ContributedSpeciesData } from '@/interfaces';
import type { FilterField } from '@/components/common/Filters/Filters.types';
import styles from './ExploreSpecies.module.css';

interface ExploreSpeciesFilters extends Record<string, unknown> {
  ecosystem?: string;
  search?: string;
}

export default function ExploreSpecies() {
  const [species, setSpecies] = useState<ContributedSpeciesData[]>([]);
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [filters, setFilters] = useState<ExploreSpeciesFilters>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Obtener todas las especies contribuidas y los ecosistemas
        const [speciesResponse, ecosystemsResponse] = await Promise.all([
          getExploreSpecies(),
          CRUDEcosystems.getAll(),
        ]);

        // Transformar los datos de especies
        const transformedSpecies: ContributedSpeciesData[] = speciesResponse.map(
          (item: ContributedSpeciesResponse) => {
            // Parsear las coordenadas del string "lat,lng"
            const [lat, lng] = item.location_coordinates.split(',').map(Number);

            return {
              id: item.id.toString(),
              name: item.name,
              description: item.sighting_description, // Usar la descripción del sighting
              location: item.location,
              coordinates: { lat, lng },
              image_url: item.image_path,
              ecosystem_name: item.ecosystem_name,
              type_specie_name: item.type_specie_name,
              sighting_description: item.sighting_description,
              contributed_date: item.contributed_date,
              total_sightings: item.total_sightings,
            };
          }
        );

        setSpecies(transformedSpecies);
        setEcosystems(ecosystemsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar especies según los filtros activos
  const filteredSpecies = species.filter((specie) => {
    // Filtro por ecosistema
    if (filters.ecosystem && specie.ecosystem_name !== filters.ecosystem) {
      return false;
    }

    // Filtro por búsqueda (nombre o descripción)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesName = specie.name.toLowerCase().includes(searchTerm);
      const matchesDescription = specie.description.toLowerCase().includes(searchTerm);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }

    return true;
  });

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

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const getSpecieTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'native':
      case 'nativa':
        return styles.typeNative;
      case 'invasive':
      case 'invasiva':
        return styles.typeInvasive;
      default:
        return styles.typeDefault;
    }
  };

  // Definir los campos de filtros
  const filterFields: FilterField[] = [
    {
      key: 'search',
      type: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por nombre o descripción...',
    },
    {
      key: 'ecosystem',
      type: 'select',
      label: 'Ecosistema',
      placeholder: 'Seleccionar ecosistema...',
      options: ecosystems.map((eco) => ({
        value: eco.name,
        label: eco.name,
      })),
    },
  ];

  // Definir las columnas de la tabla (mismos headers que History)
  const speciesColumns = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', sortable: false },
    {
      key: 'type_specie_name',
      label: 'Tipo',
      sortable: true,
      render: (value: unknown) => {
        const type = value as string;
        const typeClass = getSpecieTypeClass(type);
        return <span className={`${styles.typeTag} ${typeClass}`}>{type}</span>;
      },
    },
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
      key: 'ecosystem_name',
      label: 'Ecosistema',
      sortable: true,
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando especies...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Explorar Especies</h1>
        <p>Descubre todas las especies contribuidas por la comunidad</p>
      </div>

      <div className={styles.filtersSection}>
        <Filters
          fields={filterFields}
          values={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      <div className={styles.tableSection}>
        <Table
          columns={speciesColumns}
          data={filteredSpecies}
          loading={loading}
          emptyMessage="No se encontraron especies"
        />
      </div>

      {/* Modales */}
      <DisplayPictureModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />

      <MapModal
        isOpen={mapModal.isOpen}
        onClose={() => setMapModal({ ...mapModal, isOpen: false })}
        coordinates={mapModal.coordinates}
        title={mapModal.title}
        description={mapModal.description}
      />
    </div>
  );
}

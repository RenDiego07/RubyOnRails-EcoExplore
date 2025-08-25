import { useState, useEffect, useCallback } from 'react';
import { getMyContributedSpecies } from '@/services/CRUD/userSpecies/GET/userSpeciesGet';
import type { ContributedSpeciesResponse, ContributedSpeciesData } from '@/interfaces';

interface UseContributedSpeciesReturn {
  species: ContributedSpeciesData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Function to transform backend response to frontend data structure
function transformContributedSpecies(response: ContributedSpeciesResponse): ContributedSpeciesData {
  // Parse coordinates from string format
  let coordinates = { lat: 0, lng: 0 };

  if (response.location_coordinates) {
    try {
      const coordStr = response.location_coordinates;
      if (coordStr.includes(',')) {
        const [lat, lng] = coordStr.split(',').map((coord) => parseFloat(coord.trim()));
        coordinates = { lat: lat || 0, lng: lng || 0 };
      } else {
        // Try parsing as JSON
        const parsed = JSON.parse(coordStr);
        coordinates = {
          lat: parsed.lat || parsed.latitude || 0,
          lng: parsed.lng || parsed.longitude || 0,
        };
      }
    } catch (error) {
      console.warn('Error parsing coordinates:', error);
      coordinates = { lat: 0, lng: 0 };
    }
  }

  return {
    id: response.id.toString(),
    name: response.name,
    description: response.description,
    location: response.location,
    coordinates,
    image_url: response.image_path,
    ecosystem_name: response.ecosystem_name,
    sighting_description: response.sighting_description,
    contributed_date: response.contributed_date,
    total_sightings: response.total_sightings,
  };
}

export function useContributedSpecies(): UseContributedSpeciesReturn {
  const [species, setSpecies] = useState<ContributedSpeciesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: ContributedSpeciesResponse[] = await getMyContributedSpecies();
      const transformedSpecies = data.map(transformContributedSpecies);
      setSpecies(transformedSpecies);
    } catch (err) {
      console.error('Error fetching contributed species:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las especies contribuidas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  return {
    species,
    loading,
    error,
    refetch: fetchSpecies,
  };
}

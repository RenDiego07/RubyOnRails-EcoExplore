import { useState, useEffect, useCallback } from 'react';
import { getMySightings } from '@/services/CRUD/sightings/GET/sightingsGet';
import { transformSightingResponsesToSightings } from '@/utils/sightingResponseTransformers';
import type { SightingResponse } from '@/interfaces';
import type { Sighting } from '@/interfaces/Sighting.types';

interface UseUserSightingsReturn {
  sightings: Sighting[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserSightings(): UseUserSightingsReturn {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSightings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: SightingResponse[] = await getMySightings();
      const transformedSightings = transformSightingResponsesToSightings(data);
      setSightings(transformedSightings);
    } catch (err) {
      console.error('Error fetching user sightings:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los avistamientos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSightings();
  }, [fetchSightings]);

  return {
    sightings,
    loading,
    error,
    refetch: fetchSightings,
  };
}

import type { SightingResponse } from '@/interfaces';
import type { Sighting } from '@/interfaces/Sighting.types';

export function transformSightingResponseToSighting(sightingResponse: SightingResponse): Sighting {
  return {
    id: parseInt(sightingResponse.id),
    description: sightingResponse.description,
    sighting_location: sightingResponse.location_name || sightingResponse.sighting_location,
    sighting_location_coordinates: sightingResponse.sighting_location_coordinates,
    sighting_state_name: sightingResponse.sighting_state_name,
    image_path: sightingResponse.image_path,
    specie: sightingResponse.specie,
    created_at: sightingResponse.created_at,
  };
}

export function transformSightingResponsesToSightings(
  sightingResponses: SightingResponse[]
): Sighting[] {
  return sightingResponses.map(transformSightingResponseToSighting);
}

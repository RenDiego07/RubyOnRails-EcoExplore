import type { SightingResponse } from '@/interfaces';
import type { Sighting } from '@/interfaces/Sighting.types';

export interface HistorySighting {
  id: string;
  species_name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  date: string;
  image_url?: string;
}

export function transformSightingToHistory(sighting: Sighting): HistorySighting {
  // Parse coordinates from string format
  let coordinates = { lat: 0, lng: 0 };

  if (sighting.sighting_location_coordinates) {
    try {
      // Assuming coordinates are stored as "lat,lng" or JSON string
      const coordStr = sighting.sighting_location_coordinates;
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
    id: sighting.id.toString(),
    species_name: sighting.specie || 'Especie no identificada',
    location: sighting.sighting_location,
    coordinates,
    description: sighting.description,
    date: sighting.created_at,
    image_url: sighting.image_path,
  };
}

export function transformSightingsToHistory(sightings: Sighting[]): HistorySighting[] {
  return sightings.map(transformSightingToHistory);
}

// Legacy function - keep for compatibility with SightingResponse
export function transformSightingResponseToHistory(
  sightingResponse: SightingResponse
): HistorySighting {
  // Parse coordinates from string format
  let coordinates = { lat: 0, lng: 0 };

  if (sightingResponse.sighting_location_coordinates) {
    try {
      // Assuming coordinates are stored as "lat,lng" or JSON string
      const coordStr = sightingResponse.sighting_location_coordinates;
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
    id: sightingResponse.id,
    species_name: sightingResponse.specie || 'Especie no identificada',
    location: sightingResponse.location_name || sightingResponse.sighting_location,
    coordinates,
    description: sightingResponse.description,
    date: sightingResponse.created_at,
    image_url: sightingResponse.image_path,
  };
}

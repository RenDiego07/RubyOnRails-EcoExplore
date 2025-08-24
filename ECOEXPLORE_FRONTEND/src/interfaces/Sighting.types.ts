export interface SightingData {
  ecosystem_id: number | null;
  description: string;
  location_name: string;
  coordinates: string;
  image_path: string;
  specie: string;
}

export interface Sighting {
  id: number;
  description: string;
  sighting_location: string;
  sighting_location_coordinates?: string;
  sighting_state_name: string;
  image_path?: string;
  specie?: string;
  created_at: string;
}

export interface AxiosError {
  response?: {
    data?: {
      error?: string;
      errors?: string[];
    };
  };
}

import APIClient from '../../apiClient';

interface CreateSightingParams {
  ecosystem_id: number;
  description: string;
  location_name: string;
  coordinates?: string;
  image_path?: string;
  specie: string;
}

interface SightingResponse {
  id: number;
  user_id: number;
  ecosystem_id: number;
  location_id: number;
  sighting_state_id: number;
  sighting_state_name: string;
  sighting_location: string;
  sighting_location_coordinates: string;
  description: string;
  image_path?: string;
  specie?: string;
  created_at: string;
}

export const createSighting = async (params: CreateSightingParams): Promise<SightingResponse> => {
  try {
    const response = await APIClient.post('/sightings', params);
    return response.data;
  } catch (error) {
    console.error('Error creating sighting:', error);
    throw error;
  }
};

export const getSightings = async (): Promise<SightingResponse[]> => {
  try {
    const response = await APIClient.get('/sightings');
    return response.data;
  } catch (error) {
    console.error('Error fetching sightings:', error);
    throw error;
  }
};

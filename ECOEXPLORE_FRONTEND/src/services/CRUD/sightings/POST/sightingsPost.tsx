import APIClient from '@/services/CRUD/apiClient';
import { SightingResponse, CreateSightingParams } from '@/interfaces';

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

export const changeSightingState = async (id: string, state_code: string, specie_id: string): Promise<SightingResponse> => {
  try {
    const response = await APIClient.post(`/sightings/updateState`, { "id": id, "sighting_state_code": state_code, "specie_id": specie_id });
    return response.data;
  } catch (error) {
    console.error('Error changing sighting state:', error);
    throw error;
  }
};

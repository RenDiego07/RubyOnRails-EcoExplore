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

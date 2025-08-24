import SightingResponse from '@/interfaces/SightingResponse';
import APIClient from '@/services/CRUD/apiClient';

export const getSightings = async (): Promise<SightingResponse[]> => {
  try {
    const response = await APIClient.get('/sightings');
    return response.data;
  } catch (error) {
    console.error('Error fetching sightings:', error);
    throw error;
  }
};

export const getMySightings = async (): Promise<SightingResponse[]> => {
  try {
    const response = await APIClient.get('/sightings/my_sightings');
    return response.data;
  } catch (error) {
    console.error('Error fetching my sightings:', error);
    throw error;
  }
};

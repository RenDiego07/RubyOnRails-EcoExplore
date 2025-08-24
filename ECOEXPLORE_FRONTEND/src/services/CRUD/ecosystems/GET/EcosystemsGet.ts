import APIClient from '../../apiClient';

export interface Ecosystem {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const fetchEcosystems = async (): Promise<Ecosystem[]> => {
  try {
    const response = await APIClient.get('/ecosystems');
    return response.data;
  } catch (error) {
    console.error('Error fetching ecosystems:', error);
    throw error;
  }
};

export const fetchEcosystemById = async (id: number): Promise<Ecosystem> => {
  try {
    const response = await APIClient.get(`/ecosystems/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ecosystem by id:', error);
    throw error;
  }
};

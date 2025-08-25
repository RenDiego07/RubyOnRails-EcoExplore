import type { ContributedSpeciesResponse } from '@/interfaces';
import APIClient from '@/services/CRUD/apiClient';

export const getMyContributedSpecies = async (): Promise<ContributedSpeciesResponse[]> => {
  try {
    const response = await APIClient.get('/user_species/my_contributed_species');
    return response.data;
  } catch (error) {
    console.error('Error fetching my contributed species:', error);
    throw error;
  }
};

export const getAllContributedSpecies = async (): Promise<ContributedSpeciesResponse[]> => {
  try {
    const response = await APIClient.get('/user_species/all_contributed_species');
    return response.data;
  } catch (error) {
    console.error('Error fetching all contributed species:', error);
    throw error;
  }
};

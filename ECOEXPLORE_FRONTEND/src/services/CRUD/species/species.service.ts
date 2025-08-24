import { Species, SpeciesFilters, SpeciesFormData, TypeSpecie } from '@/types';
import APIClient from '../apiClient';

// Mock API service - Replace with real API calls
export class SpeciesService {
  // private static baseUrl = '/api/species'; // For future API integration

  static async getSpecies(): Promise<Species[] | null> {
    // Simulate API call
    const response = await APIClient.get<Species[]>('/species/getSpecies');
    if (response.data) {
      return response.data;
    }

    return null;
  }

  static async getTypeSpecies(): Promise<TypeSpecie[]> {
    // Simulate API call
    const response = await APIClient.get<TypeSpecie[]>('/type_specie/index');
    if (response.data) {
      return response.data;
    }

    return [];
  }

  static async createSpecies(speciesData: SpeciesFormData): Promise<Species> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSpecies: Species = {
          id: Date.now().toString(),
          type_specie_id: speciesData.type_specie_id,
          name: speciesData.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        resolve(newSpecies);
      }, 500);
    });
  }

  static async updateSpecies(speciesData: SpeciesFormData): Promise<Species> {
    const response = await APIClient.post(`/species/updateSpecies`, speciesData);
    if (response.data) {
      return response.data;
    }

    throw new Error('Error updating species');
  }

  static async deleteSpecies(_id: string): Promise<void> {
    await APIClient.delete(`/species/deleteSpecies/${_id}`);
  }
}

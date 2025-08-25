import { Ecosystem, EcosystemFilters, EcosystemFormData } from '@/types';
import APIClient from '../apiClient';

// Mock API service - Replace with real API calls
export class EcosystemService {
  // private static baseUrl = '/api/ecosystems'; // For future API integration

  static async getEcosystems(): Promise<Ecosystem[]> {
      try {
        const response = await APIClient.get('/ecosystems');
        return response.data;
      } catch (error) {
        console.error('Error fetching ecosystems:', error);
        throw error;
      }
  }

  static async createEcosystem(ecosystemData: EcosystemFormData): Promise<Ecosystem> {
    try {
        const response = await APIClient.post('/ecosystems', ecosystemData);
        return response.data;
    } catch (error) {
        console.error('Error creating ecosystem:', error);
        throw error;
    }
  }

  static async updateEcosystem(id: string, ecosystemData: EcosystemFormData): Promise<Ecosystem> {
    try {
        const response = await APIClient.put(`/ecosystems/${id}`, ecosystemData);
        return response.data;
    } catch (error) {
        console.error('Error updating ecosystem:', error);
        throw error;
    }
  }

  static async deleteEcosystem(_id: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
}

import { Ecosystem, EcosystemFilters, EcosystemFormData } from '@/types';

// Mock API service - Replace with real API calls
export class EcosystemService {
  // private static baseUrl = '/api/ecosystems'; // For future API integration

  static async getEcosystems(filters?: EcosystemFilters): Promise<Ecosystem[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockEcosystems: Ecosystem[] = [
          {
            id: '1',
            name: 'Bosque Tropical',
            description: 'Ecosistema caracterizado por alta biodiversidad y vegetación densa',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            name: 'Manglar',
            description: 'Ecosistema costero de transición con agua salobre',
            created_at: '2024-02-10T10:00:00Z',
            updated_at: '2024-02-10T10:00:00Z'
          }
        ];

        let filtered = mockEcosystems;

        if (filters) {
          filtered = mockEcosystems.filter(ecosystem => {
            const matchesSearch = !filters.search || 
              ecosystem.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              ecosystem.description.toLowerCase().includes(filters.search.toLowerCase());

            return matchesSearch;
          });
        }

        resolve(filtered);
      }, 500);
    });
  }

  static async createEcosystem(ecosystemData: EcosystemFormData): Promise<Ecosystem> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEcosystem: Ecosystem = {
          id: Date.now().toString(),
          name: ecosystemData.name,
          description: ecosystemData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        resolve(newEcosystem);
      }, 500);
    });
  }

  static async updateEcosystem(id: string, ecosystemData: EcosystemFormData): Promise<Ecosystem> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedEcosystem: Ecosystem = {
          id,
          name: ecosystemData.name,
          description: ecosystemData.description,
          created_at: '2024-01-01T00:00:00Z', // This would come from the API
          updated_at: new Date().toISOString()
        };
        resolve(updatedEcosystem);
      }, 500);
    });
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

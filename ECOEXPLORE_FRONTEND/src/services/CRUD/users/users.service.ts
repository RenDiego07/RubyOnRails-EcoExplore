import { User, UserFilters } from '@/types';

// Mock API service - Replace with real API calls
export class UserService {
  // private static baseUrl = '/api/users'; // For future API integration

  static async getUsers(filters?: UserFilters): Promise<User[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Juan Pérez',
            email: 'juan@example.com',
            role: 'member',
            points: 150,
            createdAt: '2024-01-15',
            isActive: true
          },
          {
            id: '2',
            name: 'María García',
            email: 'maria@example.com',
            role: 'admin',
            points: 300,
            createdAt: '2024-02-10',
            isActive: true
          },
          {
            id: '3',
            name: 'Carlos López',
            email: 'carlos@example.com',
            role: 'member',
            points: 75,
            createdAt: '2024-03-05',
            isActive: false
          },
          {
            id: '4',
            name: 'Ana Martínez',
            email: 'ana@example.com',
            role: 'member',
            points: 220,
            createdAt: '2024-01-28',
            isActive: true
          },
          {
            id: '5',
            name: 'Pedro Rodríguez',
            email: 'pedro@example.com',
            role: 'member',
            points: 95,
            createdAt: '2024-02-20',
            isActive: true
          }
        ];

        let filtered = mockUsers;

        if (filters) {
          filtered = mockUsers.filter(user => {
            const matchesSearch = !filters.search || 
              user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              user.email.toLowerCase().includes(filters.search.toLowerCase());
            
            const matchesRole = filters.role === 'all' || filters.role === undefined || user.role === filters.role;
            
            const matchesStatus = filters.status === 'all' || filters.status === undefined || 
              (filters.status === 'active' && user.isActive) ||
              (filters.status === 'inactive' && !user.isActive);

            return matchesSearch && matchesRole && matchesStatus;
          });
        }

        resolve(filtered);
      }, 500);
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = [
          {
            id: '1',
            name: 'Juan Pérez',
            email: 'juan@example.com',
            role: 'member' as const,
            points: 150,
            createdAt: '2024-01-15',
            isActive: true
          }
        ];
        
        const user = users.find(u => u.id === id) || null;
        resolve(user);
      }, 300);
    });
  }

  static async createUser(userData: Partial<User>): Promise<User> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'member',
          points: userData.points || 0,
          createdAt: new Date().toISOString().split('T')[0],
          isActive: userData.isActive ?? true
        };
        resolve(newUser);
      }, 500);
    });
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser: User = {
          id,
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'member',
          points: userData.points || 0,
          createdAt: userData.createdAt || '',
          isActive: userData.isActive ?? true
        };
        resolve(updatedUser);
      }, 500);
    });
  }

  static async deleteUser(_id: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  static async toggleUserStatus(id: string): Promise<User> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser: User = {
          id,
          name: 'Usuario Actualizado',
          email: 'usuario@example.com',
          role: 'member',
          points: 100,
          createdAt: '2024-01-01',
          isActive: true
        };
        resolve(updatedUser);
      }, 500);
    });
  }
}

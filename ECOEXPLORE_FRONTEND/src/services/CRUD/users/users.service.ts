import { User } from '@/types';
import APIClient from '../apiClient';

// Mock API service - Replace with real API calls
export class UserService {
  // private static baseUrl = '/api/users'; // For future API integration

  static async getUsers(): Promise<User[] | null> {
    // Simulate API call
    const response = await APIClient.get<User[]>('/user/getUsers');

    if (response.data) {
      return response.data;
    }

    return null;
  }

  static async deleteUser(userId: string): Promise<void> {
    await APIClient.delete(`/user/deleteUser/${userId}`);
  }
}

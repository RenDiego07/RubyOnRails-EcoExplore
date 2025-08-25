import { User } from '@/types';
import APIClient from '../apiClient';

// Interfaces para el perfil de usuario
export interface UpdateProfileData {
  name: string;
  email: string;
  profile_photo_url?: string;
}

export interface ProfilePhotoData {
  profile_photo_url: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  active: boolean;
  profile_photo_url?: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export class UserService {
  // Métodos existentes (no modificar)
  static async getUsers(): Promise<User[] | null> {
    const response = await APIClient.get<User[]>('/user/getUsers');
    if (response.data) {
      return response.data;
    }
    return null;
  }

  static async deleteUser(userId: string): Promise<void> {
    await APIClient.delete(`/user/deleteUser/${userId}`);
  }

  // Nuevos métodos para perfil de usuario

  /**
   * Obtener el perfil del usuario actual
   */
  static async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await APIClient.get<UserProfileResponse>('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Actualizar el perfil del usuario actual
   */
  static async updateProfile(userData: UpdateProfileData): Promise<UserProfileResponse> {
    try {
      const response = await APIClient.patch<UserProfileResponse>('/user/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Actualizar solo la foto de perfil
   */
  static async updateProfilePhoto(photoData: ProfilePhotoData): Promise<UserProfileResponse> {
    try {
      const response = await APIClient.patch<UserProfileResponse>('/user/profile_photo', photoData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile photo:', error);
      throw error;
    }
  }

  /**
   * Subir foto de perfil a Firebase y actualizar usuario
   */
  static async uploadAndUpdateProfilePhoto(file: File): Promise<UserProfileResponse> {
    try {
      // Importar dinámicamente el servicio de Firebase
      const { FirebaseService } = await import('@/services/firebase/firebase.service');

      // Subir imagen a Firebase
      const photoUrl = await FirebaseService.uploadImage(file, 'profile-photos');

      // Actualizar perfil con la nueva URL
      return await this.updateProfilePhoto({ profile_photo_url: photoUrl });
    } catch (error) {
      console.error('Error uploading and updating profile photo:', error);
      throw error;
    }
  }

  /**
   * Eliminar foto de perfil del usuario
   */
  static async removeProfilePhoto(currentPhotoUrl?: string): Promise<UserProfileResponse> {
    try {
      // Si hay una foto actual, eliminarla de Firebase
      if (currentPhotoUrl) {
        const { FirebaseService } = await import('@/services/firebase/firebase.service');
        await FirebaseService.deleteImage(currentPhotoUrl);
      }
      // Actualizar perfil sin foto
      return await this.updateProfilePhoto({ profile_photo_url: '' });
    } catch (error) {
      console.error('Error removing profile photo:', error);
      throw error;
    }
  }
}

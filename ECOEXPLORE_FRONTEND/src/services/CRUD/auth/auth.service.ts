import APIClient from '@/services/CRUD/apiClient';
import { EnvConfig } from '@/env.config';
import axios from 'axios';
import type { User } from '@/types/User.types';
export interface LoginFields {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export class AuthService {
  static async login(payload: LoginFields) {
    const response = await axios.post(`${EnvConfig.back_end_url}/auth/login`, payload, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  static async forgotPassword(email: string) {
    const response = await axios.post(
      `${EnvConfig.back_end_url}/auth/forgot-password`,
      { email },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  static async register(userData: RegisterData) {
    const response = await axios.post(`${EnvConfig.back_end_url}/auth/register`, userData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  static async getCurrentUser(): Promise<User | null> {
    const response = await APIClient.get<User>('/auth/me');
    if (response.data) {
      return response.data;
    }
    return null;
  }

  static logout(): void {
    localStorage.removeItem('token');
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static decodeToken(token: string): { user_id: string; role: string; exp: number } | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }

  static isTokenValid(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    const now = Date.now() / 1000;
    return decoded.exp > now;
  }

  static getUserRole(): string | null {
    const token = this.getToken();
    if (!token || !this.isTokenValid(token)) return null;

    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }
}

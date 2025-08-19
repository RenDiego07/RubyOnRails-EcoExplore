import { useState, useEffect } from 'react';
import { User, UserFilters } from '@/types';
import { UserFormData } from '@/components/forms';
import { UserService } from '@/services/CRUD/users/users.service';

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async (filters?: UserFilters) => {
    try {
      setLoading(true);
      const data = await UserService.getUsers(filters);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: UserFormData): Promise<User> => {
    try {
      setActionLoading(true);
      const newUser = await UserService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const updateUser = async (id: string, userData: UserFormData): Promise<User> => {
    try {
      setActionLoading(true);
      const updatedUser = await UserService.updateUser(id, userData);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      setActionLoading(true);
      await UserService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const toggleUserStatus = async (id: string): Promise<User> => {
    try {
      setActionLoading(true);
      const updatedUser = await UserService.toggleUserStatus(id);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      return updatedUser;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    actionLoading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
  };
}

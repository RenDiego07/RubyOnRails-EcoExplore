import { useState, useEffect } from 'react';
import { User } from '@/types';
import { UserService } from '@/services/CRUD/users/users.service';

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUsers();
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setActionLoading(true);
      await UserService.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      console.log('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
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
    deleteUser,
  };
}

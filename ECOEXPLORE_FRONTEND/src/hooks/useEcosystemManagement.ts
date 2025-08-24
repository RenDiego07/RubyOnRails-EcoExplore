import { useState, useEffect } from 'react';
import { Ecosystem, EcosystemFilters } from '@/types';
import { EcosystemFormData } from '@/types';
import { EcosystemService } from '@/services/CRUD/ecosystems/ecosystems.service';

export function useEcosystemManagement() {
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadEcosystems = async (filters?: EcosystemFilters) => {
    try {
      setLoading(true);
      const data = await EcosystemService.getEcosystems(filters);
      setEcosystems(data);
    } catch (error) {
      console.error('Error loading ecosystems:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createEcosystem = async (ecosystemData: EcosystemFormData): Promise<Ecosystem> => {
    try {
      setActionLoading(true);
      const newEcosystem = await EcosystemService.createEcosystem(ecosystemData);
      setEcosystems(prev => [...prev, newEcosystem]);
      return newEcosystem;
    } catch (error) {
      console.error('Error creating ecosystem:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const updateEcosystem = async (id: string, ecosystemData: EcosystemFormData): Promise<Ecosystem> => {
    try {
      setActionLoading(true);
      const updatedEcosystem = await EcosystemService.updateEcosystem(id, ecosystemData);
      setEcosystems(prev => prev.map(ecosystem => 
        ecosystem.id === id ? updatedEcosystem : ecosystem
      ));
      return updatedEcosystem;
    } catch (error) {
      console.error('Error updating ecosystem:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteEcosystem = async (id: string): Promise<void> => {
    try {
      setActionLoading(true);
      await EcosystemService.deleteEcosystem(id);
      setEcosystems(prev => prev.filter(ecosystem => ecosystem.id !== id));
    } catch (error) {
      console.error('Error deleting ecosystem:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    loadEcosystems();
  }, []);

  return {
    ecosystems,
    loading,
    actionLoading,
    loadEcosystems,
    createEcosystem,
    updateEcosystem,
    deleteEcosystem
  };
}

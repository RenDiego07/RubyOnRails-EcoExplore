import { useState, useEffect } from 'react';
import { Species, SpeciesCreationData, SpeciesFilters, TypeSpecie } from '@/types';
import { SpeciesFormData } from '@/types';
import { SpeciesService } from '@/services/CRUD/species/species.service';
import { set } from 'react-hook-form';
import { S } from 'node_modules/framer-motion/dist/types.d-Cjd591yU';

export function useSpeciesManagement() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [typeSpecies, setTypeSpecies] = useState<TypeSpecie[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadSpecies = async () => {
    try {
      setLoading(true);
      const data = await SpeciesService.getSpecies();
      if(data) {
        setSpecies(data);
      } else {
        setSpecies([]);
      }
    } catch (error) {
      console.error('Error loading species:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadTypeSpecies = async () => {
    try {
      const data = await SpeciesService.getTypeSpecies();
      setTypeSpecies(data);
    } catch (error) {
      console.error('Error loading type species:', error);
      throw error;
    }
  };

  const createSpecies = async (speciesData: SpeciesCreationData): Promise<Species> => {
    try {
      setActionLoading(true);
      const newSpecies = await SpeciesService.createSpecies(speciesData);
      setSpecies(prev => [...prev, newSpecies]);
      return newSpecies;
    } catch (error) {
      console.error('Error creating species:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const updateSpecies = async (id: string, speciesData: SpeciesFormData): Promise<Species> => {
    try {
      setActionLoading(true);
      const updatedSpecies = await SpeciesService.updateSpecies(speciesData);
      setSpecies(prev => prev.map(species => 
        species.id === id ? updatedSpecies : species
      ));
      return updatedSpecies;
    } catch (error) {
      console.error('Error updating species:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteSpecies = async (id: string): Promise<void> => {
    try {
      setActionLoading(true);
      await SpeciesService.deleteSpecies(id);
      setSpecies(prev => prev.filter(species => species.id !== id));
    } catch (error) {
      console.error('Error deleting species:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    loadSpecies();
    loadTypeSpecies();
  }, []);

  return {
    species,
    typeSpecies,
    loading,
    actionLoading,
    loadSpecies,
    createSpecies,
    updateSpecies,
    deleteSpecies
  };
}

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSightings } from '@/services/CRUD/sightings/GET/sightingsGet';
import { SightingResponse } from '@/interfaces';
import { changeSightingState } from '@/services/CRUD/sightings/POST/sightingsPost';
import { SpeciesApprovalData } from '../components/common/Modals/SpeciesApprovalModal/SpeciesApprovalModal.types';
import { SpeciesService } from '@/services/CRUD/species/species.service';
import { s } from 'framer-motion/client';

export interface UseSightingManagementReturn {
  sightings: SightingResponse[];
  filteredSightings: SightingResponse[];
  loading: boolean;
  filters: Record<string, string>;
  selectedSighting: SightingResponse | null;
  isSpeciesModalOpen: boolean;
  pendingSightingForApproval: SightingResponse | null;
  handleFilterChange: (field: string, value: unknown) => void;
  handleFilterReset: () => void;
  handleRowClick: (sighting: SightingResponse) => void;
  handleDetailModalClose: () => void;
  handleApprovalConfirm: (id: string) => void;
  handleRejectConfirm: (id: string) => void;
  handleSpeciesModalClose: () => void;
  handleSpeciesConfirm: (data: SpeciesApprovalData) => void;
}

export const useSightingManagement = (): UseSightingManagementReturn => {
  const [sightings, setSightings] = useState<SightingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedSighting, setSelectedSighting] = useState<SightingResponse | null>(null);
  const [isSpeciesModalOpen, setIsSpeciesModalOpen] = useState(false);
  const [pendingSightingForApproval, setPendingSightingForApproval] = useState<SightingResponse | null>(null);

  // Filter sightings based on active filters
  const filteredSightings = useMemo(() => {
    return sightings.filter(sighting => {
      // User name filter
      if (filters.user_name && filters.user_name.trim() !== '') {
        if (!sighting.user_name.toLowerCase().includes(filters.user_name.toLowerCase().trim())) {
          return false;
        }
      }

      // Ecosystem filter
      if (filters.ecosystem_name && filters.ecosystem_name.trim() !== '') {
        if (!sighting.ecosystem_name.toLowerCase().includes(filters.ecosystem_name.toLowerCase().trim())) {
          return false;
        }
      }

      // State filter
      if (filters.sighting_state_name && filters.sighting_state_name !== '') {
        const filterState = filters.sighting_state_name.toLowerCase();
        const sightingState = sighting.sighting_state_name.toLowerCase();
        
        // Map the filter values to possible state names (both English and Spanish)
        const stateMapping: Record<string, string[]> = {
          'pending': ['pending', 'pendiente'],
          'accepted': ['accepted', 'aprobado', 'approved'],
          'rejected': ['rejected', 'rechazado']
        };
        
        const possibleStates = stateMapping[filterState] || [filterState];
        if (!possibleStates.includes(sightingState)) {
          return false;
        }
      }

      // Species filter
      if (filters.specie && filters.specie.trim() !== '') {
        if (!sighting.specie || !sighting.specie.toLowerCase().includes(filters.specie.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [sightings, filters]);

  const loadSightings = async () => {
    setLoading(true);
    try {
      const response = await getSightings();
      setSightings(response);
    } catch (error) {
      console.error('Error loading sightings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((field: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [field]: String(value) }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters({});
  }, []);

  const handleRowClick = useCallback((sighting: SightingResponse) => {
    setSelectedSighting(sighting);
  }, []);

  const handleDetailModalClose = useCallback(() => {
    setSelectedSighting(null);
  }, []);

  const handleApprovalConfirm = useCallback(async (id: string) => {
    // Find the sighting to approve
    const sightingToApprove = sightings.find(s => s.id.toString() === id);
    if (sightingToApprove) {
      setPendingSightingForApproval(sightingToApprove);
      setIsSpeciesModalOpen(true);
      setSelectedSighting(null); // Close the detail modal
    }
  }, [sightings]);

  const handleRejectConfirm = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // TODO: Implement rejection API call
      await changeSightingState(id, 'REJECTED', '');
      await loadSightings(); // Refresh data
    } catch (error) {
      console.error('Error rejecting sighting:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSpeciesModalClose = useCallback(() => {
    setIsSpeciesModalOpen(false);
    setPendingSightingForApproval(null);
  }, []);

  const handleSpeciesConfirm = useCallback(async (data: SpeciesApprovalData) => {
    if (!pendingSightingForApproval) return;

    let specie_id: string = '';

    setLoading(true);
    try {
      // Handle species creation/selection in frontend only
      if (data.action === 'create' && data.speciesName && data.typeSpecieId) {
        const newSpeciesData = {
          name: data.speciesName,
          type_specie_id: data.typeSpecieId
        };
        
        try {
          // Create the species in the frontend system only
          const specie = await SpeciesService.createSpecies(newSpeciesData);
          specie_id = specie.id;
          console.log('Nueva especie creada:', data.speciesName);
        } catch (speciesError) {
          console.error('Error creating species:', speciesError);
          // Continue with approval even if species creation fails
        }
      } else if (data.action === 'select' && data.selectedSpeciesId) {
        console.log('Especie existente seleccionada:', data.selectedSpeciesId);
      } else if (data.action === 'select' && data.selectedSpeciesId) {
        specie_id = data.selectedSpeciesId;
      }

      // Approve the sighting (backend already has the specie field as text)
      await changeSightingState(pendingSightingForApproval.id.toString(), 'ACCEPTED', specie_id, pendingSightingForApproval.user_id);

      // Refresh data
      await loadSightings();
      
      // Close modal
      setIsSpeciesModalOpen(false);
      setPendingSightingForApproval(null);
    } catch (error) {
      console.error('Error confirming species:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  }, [pendingSightingForApproval]);

  useEffect(() => {
    loadSightings();
  }, []);

  return {
    sightings,
    filteredSightings,
    loading,
    filters,
    selectedSighting,
    isSpeciesModalOpen,
    pendingSightingForApproval,
    handleFilterChange,
    handleFilterReset,
    handleRowClick,
    handleDetailModalClose,
    handleApprovalConfirm,
    handleRejectConfirm,
    handleSpeciesModalClose,
    handleSpeciesConfirm
  };
};

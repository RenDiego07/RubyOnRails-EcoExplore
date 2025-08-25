export interface Species {
  id: string;
  type_specie_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  type_specie?: TypeSpecie; // Para cuando se incluye la relación
}

export interface TypeSpecie {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface SpeciesFilters {
  type_specie_id?: string | 'all';
  search?: string;
}

export interface SpeciesFormData {
  id: string;
  name: string;
  type_specie_id: string;
}

export interface SpeciesCreationData {
  name: string;
  type_specie_id: string;
}
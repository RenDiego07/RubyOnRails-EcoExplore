export interface Ecosystem {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface EcosystemFilters {
  search?: string;
}

export interface EcosystemFormData {
  name: string;
  description: string;
}

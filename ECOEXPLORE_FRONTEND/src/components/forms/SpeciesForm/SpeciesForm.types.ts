export interface SpeciesFormProps {
  initialData?: Partial<SpeciesFormData>;
  typeSpecies: TypeSpecie[];
  onSubmit: (data: SpeciesFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

import type { SpeciesFormData, TypeSpecie } from '@/types';

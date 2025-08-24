export interface EcosystemFormProps {
  initialData?: Partial<EcosystemFormData>;
  onSubmit: (data: EcosystemFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

import type { EcosystemFormData } from '@/types';

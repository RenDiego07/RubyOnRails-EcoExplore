export interface SpeciesApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: SpeciesApprovalData) => void;
  defaultSpecieName: string;
  loading?: boolean;
}

export interface SpeciesApprovalData {
  action: 'create' | 'select';
  speciesName?: string;
  selectedSpeciesId?: string;
  typeSpecieId?: string;
}

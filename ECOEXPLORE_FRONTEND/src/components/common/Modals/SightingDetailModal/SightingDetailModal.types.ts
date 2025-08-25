import { SightingResponse } from '@/interfaces';

export interface SightingDetailModalProps {
  sighting: SightingResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

export interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  hasActionButtons?: boolean;
  isActionDisabled?: boolean;
  isActionLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  size?: 'small' | 'medium' | 'large';
}

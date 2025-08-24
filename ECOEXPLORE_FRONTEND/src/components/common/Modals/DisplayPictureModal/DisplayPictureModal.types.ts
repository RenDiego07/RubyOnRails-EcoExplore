export interface DisplayPictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
}

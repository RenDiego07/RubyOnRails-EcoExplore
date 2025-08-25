import { Avatar } from '@/components/common';
import styles from './ProfilePhotoDisplay.module.css';

interface ProfilePhotoDisplayProps {
  photoUrl?: string;
  userName: string;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
}

export default function ProfilePhotoDisplay({
  photoUrl,
  userName,
  size = 'large',
  showBorder = true,
}: ProfilePhotoDisplayProps) {
  return (
    <div
      className={`${styles.photoContainer} ${styles[size]} ${showBorder ? styles.withBorder : ''}`}
    >
      <Avatar src={photoUrl} alt={`Foto de perfil de ${userName}`} size={size} name={userName} />
    </div>
  );
}

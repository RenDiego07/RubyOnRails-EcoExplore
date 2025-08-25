import { useState, useEffect } from 'react';
import { AvatarProps } from './Avatar.types';
import styles from './Avatar.module.css';

export default function Avatar({
  src,
  alt,
  size = '2.5rem',
  className = '',
  name = 'Usuario',
  onClick,
}: AvatarProps) {
  const [isImageValid, setIsImageValid] = useState(true);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getColorVariant = (name: string) => {
    const variants = [
      'red',
      'orange',
      'amber',
      'yellow',
      'lime',
      'green',
      'emerald',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuchsia',
      'pink',
      'rose',
      'slate',
      'gray',
      'stone',
      'neutral',
      'zinc',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return variants[hash % variants.length];
  };

  const initials = getInitials(name);
  const colorVariant = getColorVariant(name);

  useEffect(() => {
    if (!src) {
      setIsImageValid(false);
      return;
    }

    let isMounted = true;
    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      if (isMounted) {
        setIsImageValid(true);
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setIsImageValid(false);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <figure
      className={`${styles.avatarContainer} ${className}`}
      style={{
        width: size,
        height: size,
      }}
      title={alt || name}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {src && isImageValid ? (
        <img
          src={src}
          alt={alt || name}
          className={styles.avatarImage}
          onError={() => setIsImageValid(false)}
        />
      ) : (
        <div
          className={`${styles.avatarPlaceholder} ${styles[`variant-${colorVariant}`]}`}
          style={{ fontSize: `calc(${size} * 0.4)` }}
        >
          {initials}
        </div>
      )}
    </figure>
  );
}

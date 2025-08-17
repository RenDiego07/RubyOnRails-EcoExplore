import { useContext } from 'react';
import { ToastContext } from '@/providers/ToastProvider';
import type { ToastContextType } from '@/providers/ToastProvider';

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

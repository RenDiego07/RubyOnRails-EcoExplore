import { ReactNode } from 'react';
import { ModalProvider } from './ModalProvider';
import ToastProvider from './ToastProvider';

type UIProviderProps = {
  children: ReactNode;
};

/**
 * UIProvider - Proveedor global para todos los componentes de interfaz de usuario
 * Incluye: Modales, Toasts, y otros elementos de UI globales
 */
export const UIProvider = ({ children }: UIProviderProps) => {
  return (
    <ModalProvider>
      <ToastProvider>{children}</ToastProvider>
    </ModalProvider>
  );
};

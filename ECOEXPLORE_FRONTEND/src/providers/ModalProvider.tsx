import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
} from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

type ModalEntry = {
  id: number;
  element: ReactElement;
};

type ModalContextType = {
  showModal: (element: ReactElement<Partial<ModalComponentProps>>) => number;
  closeModal: (id?: number) => void;
};

type ModalComponentProps = {
  close: () => void;
  id: number;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalEntry[]>([]);
  const modalsContainerRef = useRef<HTMLDivElement>(null);

  // Crear el elemento modal-root si no existe
  useEffect(() => {
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  }, []);

  const showModal = (element: ReactElement): number => {
    const id = Date.now() + Math.random();
    setModals((prev) => [...prev, { id, element }]);
    return id;
  };

  const closeModal = (id?: number) => {
    if (id != null) {
      setModals((prev) => prev.filter((m) => m.id !== id));
    } else {
      setModals([]);
    }
  };

  useEffect(() => {
    if (modals.length > 0 && modalsContainerRef.current) {
      modalsContainerRef.current.focus();
    }
  }, [modals]);

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {ReactDOM.createPortal(
        <div
          ref={modalsContainerRef}
          tabIndex={-1}
          aria-live="polite"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <AnimatePresence>
            {modals.map(({ id, element }, index) => {
              // inyectamos props `close` e `id` al componente
              const elementWithProps = React.cloneElement(
                element as ReactElement<ModalComponentProps>,
                { close: () => closeModal(id), id }
              );

              return (
                <motion.div key={id} style={{ pointerEvents: 'auto', zIndex: 1000 + index }}>
                  {elementWithProps}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.getElementById('modal-root') || document.body
      )}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

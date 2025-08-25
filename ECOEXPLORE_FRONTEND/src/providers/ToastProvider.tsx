import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

type ToastResult = boolean | string | number | object | null;

type ToastEntry = {
  id: number;
  message: string;
  renderFn: (close: (result?: ToastResult) => void) => React.ReactElement;
  duration?: number;
  resolve?: (value: ToastResult) => void;
};

export type ToastContextType = {
  showToast: (
    renderFn: (close: (result?: ToastResult) => void) => React.ReactElement,
    duration?: number,
    message?: string
  ) => Promise<ToastResult>;
  closeToast: (id: number) => void;
  extractMessage: (element: React.ReactElement) => string;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastProviderProps = {
  children: ReactNode;
};

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const extractMessage = useCallback((element: React.ReactElement): string => {
    if (element?.props?.message) {
      return element.props.message;
    }

    if (typeof element === 'string') {
      return element;
    }

    if (element?.props?.children) {
      const children = element.props.children;
      if (typeof children === 'string') {
        return children;
      }
    }

    return '';
  }, []);

  const showToast = useCallback(
    (
      renderFn: (close: (result?: ToastResult) => void) => React.ReactElement,
      duration = 5000,
      explicitMessage?: string
    ): Promise<ToastResult> => {
      return new Promise<ToastResult>((resolve) => {
        const id = Date.now() + Math.random();

        const dummyClose = () => {};
        const sampleElement = renderFn(dummyClose);
        const message = explicitMessage || extractMessage(sampleElement);

        const closeWithResult = (result?: ToastResult) => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
          resolve(result || false);
        };

        setToasts((prev) => {
          const existingToastIndex = prev.findIndex((t) => t.message === message);

          if (existingToastIndex !== -1 && message.trim() !== '') {
            const existingToast = prev[existingToastIndex];

            if (existingToast.resolve) {
              existingToast.resolve(false);
            }

            const newToast: ToastEntry = {
              id,
              message,
              renderFn: () => renderFn(closeWithResult),
              duration,
              resolve: resolve,
            };

            const newToasts = [...prev];
            newToasts[existingToastIndex] = newToast;

            return newToasts;
          } else {
            const newToast: ToastEntry = {
              id,
              message,
              renderFn: () => renderFn(closeWithResult),
              duration,
              resolve: resolve,
            };

            return [...prev, newToast];
          }
        });

        if (duration > 0) {
          setTimeout(() => {
            setToasts((prev) => {
              const filtered = prev.filter((t) => t.id !== id);
              if (prev.some((t) => t.id === id)) {
                resolve(false);
              }
              return filtered;
            });
          }, duration);
        }
      });
    },
    [extractMessage]
  );

  const closeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({ showToast, closeToast, extractMessage }),
    [showToast, closeToast, extractMessage]
  );

  const containerStyle = useMemo(
    (): React.CSSProperties => ({
      position: 'fixed',
      top: 'var(--spacing-200, 1.6rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-100, 0.8rem)',
      alignItems: 'center',
    }),
    []
  );

  const bounceVariants = useMemo(
    () =>
      ({
        initial: {
          opacity: 0,
          y: -50,
          scale: 0.8,
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            damping: 15,
            stiffness: 300,
            duration: 0.4,
          },
        },
        exit: {
          opacity: 0,
          y: -30,
          scale: 0.9,
          transition: {
            duration: 0.2,
            ease: 'easeIn',
          },
        },
      }) as const,
    []
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {createPortal(
        <div style={containerStyle}>
          <AnimatePresence mode="popLayout">
            {toasts.map(({ id, renderFn }) => {
              const close = () => closeToast(id);
              const element = renderFn(close);

              return (
                <motion.div
                  key={id}
                  variants={bounceVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                >
                  {element}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

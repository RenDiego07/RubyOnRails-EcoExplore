import React, { useState, useRef, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Dropdown.module.css';
import { ArrowIcon } from '@/icons';
import DropdownSearchInput from './DropdownSearchInput';
import type { DropdownBaseProps, Option } from './Dropdown.types';

export default function DropdownBase({
  value,
  trigger = (selected) => {
    if (Array.isArray(selected)) {
      return (
        <div className={styles.trigger_selector}>
          {selected.length > 0 ? (
            <p>{`${selected.length} options selected`}</p>
          ) : (
            <p className={styles.placeholder}>{placeholder}</p>
          )}
        </div>
      );
    }
    return (
      <div className={styles.trigger_selector}>
        {selected ? (
          <div className={styles.trigger_content}>
            {selected.icon && (
              <span className={styles.trigger_icon} aria-hidden="true">
                {selected.icon}
              </span>
            )}
            <span className={styles.trigger_label}>{selected.label}</span>
          </div>
        ) : (
          <p className={styles.placeholder}>{placeholder}</p>
        )}
      </div>
    );
  },
  header,
  useHeaderAsTrigger = false,
  isOpen: controlledIsOpen,
  options = [
    { label: 'Option1', value: 'opt' },
    { label: 'Option2', value: 'opt2' },
  ],
  groupLabels = [],
  onSelect = (option) => {
    console.warn('The onSelect function is not defined. Please provide a valid function.');
    console.log('Selected option:', option);
  },
  onOpenDropdown,
  required = false,
  name,
  searchable = true,
  placeholder = 'Seleccione...',
  searcherPlaceholder = 'Buscar...',
  inputClearable = true,
  dropdownClassName = styles.dropdown,
  triggerClassName = styles.trigger,
  dropdownButtonToggleClassName = styles.dropdown_button_toggle,
  dropdownIconClassName = styles.dropdown_icon,
  dropdownIconOpenClassName = styles.dropdown_icon_open,
  menuClassName = styles.menu,
  activeClassName = '',
  menuItemClassName = styles['menu__item'],
  selectedClassName = styles['menu__item--selected'],
  highlightedClassName = styles['menu__item--highlighted'],
  selectionEnabled = true,
  allowDeselect = true,
  defaultValue = null,
  hideArrowIcon = false,
  noOptionsText = 'No hay opciones disponibles',
  noOptionsClassName = styles.no_options,
  disabled = false,
}: DropdownBaseProps) {
  const isMultiList = Array.isArray(options) && options.some(Array.isArray);
  const isControlled = value !== undefined;
  const [selected, setSelected] = useState<Option | Option[] | null>(
    isControlled
      ? value
      : isMultiList
        ? (defaultValue as Option[]) || []
        : (defaultValue as Option) || null
  );

  useEffect(() => {
    if (isControlled) {
      setSelected(value || null);
    }
  }, [value, isControlled]);

  const isControlledOpen = controlledIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isControlledOpen ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (value: boolean) => {
      if (!isControlledOpen) {
        setInternalIsOpen(value);
      }
      onOpenDropdown?.(value);
    },
    [isControlledOpen, onOpenDropdown]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [menuPosition, setMenuPosition] = useState<React.CSSProperties>({
    left: '-9999px',
    top: '-9999px',
    position: 'fixed',
    zIndex: 9999,
  });
  const [menuReady, setMenuReady] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);

  // Nuevo: guardar el label seleccionado para mostrarlo en el buscador
  const [selectedLabel, setSelectedLabel] = useState('');

  const toggleDropdown = () => {
    if (disabled) return;

    if (!isOpen) {
      setIsOpen(true);
      setMenuReady(false);

      const initialIndex = getSelectedOptionIndex >= 0 ? getSelectedOptionIndex : 0;
      setHighlightedIndex(initialIndex);

      if (searchable) {
        // Mostrar el label seleccionado en el buscador
        let label = '';
        if (!isMultiList && selected && (selected as Option)?.label) {
          label = (selected as Option).label;
        }
        setSearchTerm(label);
        setSelectedLabel(label);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            // Situar el cursor al final
            inputRef.current.setSelectionRange(label.length, label.length);
          }
        }, 50);
      }

      onOpenDropdown?.(true);
    } else {
      setIsOpen(false);
      setHighlightedIndex(-1);
      onOpenDropdown?.(false);
    }
  };

  // Manejar cambios en el input de búsqueda
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    // Limpiar el label seleccionado cuando el usuario empieza a escribir
    if (selectedLabel && val !== selectedLabel) {
      setSelectedLabel('');
    }
  };

  const updateMenuPosition = () => {
    if (!dropdownRef.current || !menuRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    const dropdownWidth = dropdownRef.current.offsetWidth;
    const menuWidth = menuRef.current.offsetWidth;
    const menuHeight = menuRef.current.offsetHeight;

    // Calcular el ancho mínimo basado en el contenido más largo
    const minContentWidth = Math.max(dropdownWidth, menuWidth);

    let top: number;
    if (rect.bottom + menuHeight <= window.innerHeight) {
      top = rect.bottom;
    } else if (rect.top >= menuHeight) {
      top = rect.top - menuHeight;
    } else {
      top = (window.innerHeight - menuHeight) / 2;
    }

    let left: number;
    if (rect.left + minContentWidth <= window.innerWidth) {
      left = rect.left;
    } else if (rect.right >= minContentWidth) {
      left = rect.right - minContentWidth;
    } else {
      left = (window.innerWidth - minContentWidth) / 2;
    }

    setMenuPosition({
      left: `${left}px`,
      top: `${top}px`,
      position: 'fixed',
      zIndex: 9999,
      width: 'auto',
      minWidth: `${dropdownWidth}px`,
    });
  };

  useEffect(() => {
    const handleScroll = () => updateMenuPosition();
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    if (menuReady) updateMenuPosition();
  }, [menuReady]);

  useLayoutEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        updateMenuPosition();
        setMenuReady(true);
      });
    }
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    if (!selectionEnabled) {
      onSelect(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (isMultiList) {
      const selectedArray = (selected as Option[]) || [];
      const exists = selectedArray.find((o) => o.value === option.value);
      let newSelection: Option[];
      if (exists) {
        newSelection = selectedArray.filter((o) => o.value !== option.value);
      } else {
        newSelection = [...selectedArray, option];
      }
      if (!isControlled) {
        setSelected(newSelection);
      }
      onSelect(newSelection);
      const flatOptions = isMultiList
        ? (filteredOptions as Option[][]).flat()
        : (filteredOptions as Option[]);
      const currentIndex = flatOptions.findIndex((o) => o.value === option.value);
      setHighlightedIndex(Math.min(currentIndex, flatOptions.length - 1));
      if (searchable) {
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    } else {
      const current = selected as Option | null;
      const isSame = current?.value === option.value;
      let newSelection: Option | null;
      if (allowDeselect && isSame) {
        newSelection = null;
      } else {
        newSelection = option;
      }
      if (!isControlled) {
        setSelected(newSelection);
      }
      onSelect(newSelection);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onOpenDropdown?.(false);
      setTimeout(() => {
        if (dropdownRef.current) {
          const trigger = dropdownRef.current.querySelector('[tabindex]') as HTMLElement;
          trigger?.focus();
        }
      }, 100);
    }
  };

  const filteredOptions = useMemo(() => {
    const filterFn = (opts: Option[]) =>
      opts.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!searchable || !searchTerm.trim()) {
      return options;
    }

    if (isMultiList) {
      return (options as Option[][]).map(filterFn);
    }

    return filterFn(options as Option[]);
  }, [searchTerm, options, isMultiList, searchable]);

  // Función helper para encontrar el índice de la opción seleccionada
  const getSelectedOptionIndex = useMemo(() => {
    if (!selected) return -1;

    const flatOptions = isMultiList
      ? (filteredOptions as Option[][]).flat()
      : (filteredOptions as Option[]);

    if (isMultiList) {
      const selectedArray = selected as Option[];
      if (selectedArray.length === 0) return -1;
      return flatOptions.findIndex((option) => option.value === selectedArray[0].value);
    } else {
      const selectedOption = selected as Option;
      return flatOptions.findIndex((option) => option.value === selectedOption.value);
    }
  }, [selected, filteredOptions, isMultiList]);

  const isSelected = (option: Option): boolean => {
    if (isMultiList) {
      return (selected as Option[]).some((o) => o.value === option.value);
    }
    return (selected as Option)?.value === option.value;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    // Si el dropdown no está abierto, manejamos la apertura
    if (!isOpen) {
      switch (e.key) {
        case 'Enter':
        case ' ': // Espacio
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault();
          setIsOpen(true);
          setIsKeyboardNavigation(true);
          const initialIndex = getSelectedOptionIndex >= 0 ? getSelectedOptionIndex : 0;
          setHighlightedIndex(initialIndex);

          if (searchable && inputClearable) {
            setSearchTerm('');
          }
          if (searchable) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 50);
          }

          onOpenDropdown?.(true);
          break;
        }
        case 'Escape':
          e.preventDefault();
          if (dropdownRef.current) {
            dropdownRef.current.blur();
          }
          break;
      }
      return;
    }

    if (!menuRef.current) return;

    const flatOptions = isMultiList
      ? (filteredOptions as Option[][]).flat()
      : (filteredOptions as Option[]);
    const maxIndex = flatOptions.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (flatOptions.length === 0) return;
        setIsKeyboardNavigation(true);
        setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (flatOptions.length === 0) return;
        setIsKeyboardNavigation(true);
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter': {
        e.preventDefault();
        if (flatOptions.length === 0) {
          setIsOpen(false);
          setHighlightedIndex(-1);
          onOpenDropdown?.(false);
          if (dropdownRef.current) {
            const trigger = dropdownRef.current.querySelector('[tabindex]') as HTMLElement;
            trigger?.focus();
          }
          return;
        }
        if (highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
          handleSelect(flatOptions[highlightedIndex]);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        onOpenDropdown?.(false);
        if (dropdownRef.current) {
          const trigger = dropdownRef.current.querySelector('[tabindex]') as HTMLElement;
          trigger?.focus();
        }
        break;
      }
      case 'Tab':
        setIsOpen(false);
        setHighlightedIndex(-1);
        onOpenDropdown?.(false);
        break;
      case 'Home':
        e.preventDefault();
        if (flatOptions.length === 0) return;
        setIsKeyboardNavigation(true);
        setHighlightedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        if (flatOptions.length === 0) return;
        setIsKeyboardNavigation(true);
        setHighlightedIndex(maxIndex);
        break;
    }
  };

  /* Manejo de actualización del índice resaltado */
  useEffect(() => {
    if (!isOpen) return;
    const flatOptions = isMultiList
      ? (filteredOptions as Option[][]).flat()
      : (filteredOptions as Option[]);
    // Si no hay opciones, reseteamos el índice
    if (flatOptions.length === 0) {
      setHighlightedIndex(-1);
      return;
    }
    // Si el índice actual está fuera del rango, ajustarlo
    if (highlightedIndex >= flatOptions.length) {
      setHighlightedIndex(Math.max(0, flatOptions.length - 1));
      return;
    }
    // Si el índice actual es -1 o la opción ya no existe, vamos a la primera opción
    if (highlightedIndex < 0) {
      setHighlightedIndex(0);
    }
  }, [filteredOptions, isOpen, highlightedIndex, isMultiList]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    // Manejo de navegación por teclado
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Home', 'End'].includes(e.key)) {
      handleKeyDown(e);
      return;
    }

    // Para teclas de escritura normal, actualizar el índice destacado
    if (!['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
      setTimeout(() => {
        const flatOptions = isMultiList
          ? (filteredOptions as Option[][]).flat()
          : (filteredOptions as Option[]);

        if (flatOptions.length > 0 && highlightedIndex !== 0) {
          setIsKeyboardNavigation(true);
          setHighlightedIndex(0);
        }
      }, 0);
    }
  };

  const renderOptions = () => {
    if (isMultiList) {
      const groups = filteredOptions as Option[][];
      let globalIndex = 0;

      return groups.map((group, index) => (
        <li key={`group-${index}`}>
          {groupLabels[index] && (
            <div className={styles.group_label} role="presentation">
              {groupLabels[index]}
            </div>
          )}
          <ul role="group" className={styles.option_group}>
            {group.map((option) => {
              const currentGlobalIndex = globalIndex++;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected(option)}
                  className={`
                    ${menuItemClassName}
                    ${isSelected(option) ? selectedClassName : ''}
                    ${highlightedIndex === currentGlobalIndex ? highlightedClassName : ''}
                  `}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => {
                    setIsKeyboardNavigation(false);
                    setHighlightedIndex(currentGlobalIndex);
                  }}
                >
                  {option.icon && (
                    <span className={styles.option_icon} aria-hidden="true">
                      {option.icon}
                    </span>
                  )}
                  <span className={styles.option_label}>{option.label}</span>
                </li>
              );
            })}
          </ul>
        </li>
      ));
    }

    const opts = filteredOptions as Option[];

    return opts.length ? (
      opts.map((option, index) => (
        <li
          key={option.value}
          role="option"
          aria-selected={isSelected(option)}
          className={`
            ${menuItemClassName}
            ${isSelected(option) ? selectedClassName : ''}
            ${highlightedIndex === index ? highlightedClassName : ''}
          `}
          onClick={() => handleSelect(option)}
          onMouseEnter={() => {
            setIsKeyboardNavigation(false);
            setHighlightedIndex(index);
          }}
        >
          {option.icon && (
            <span className={styles.option_icon} aria-hidden="true">
              {option.icon}
            </span>
          )}
          <span className={styles.option_label}>{option.label}</span>
        </li>
      ))
    ) : (
      <li className={noOptionsClassName} role="option" aria-disabled="true">
        {noOptionsText}
      </li>
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleFocusOut = () => {
      setTimeout(() => {
        const activeElement = document.activeElement;

        if (
          !dropdownRef.current?.contains(activeElement) &&
          !menuRef.current?.contains(activeElement)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
          onOpenDropdown?.(false);
        }
      }, 10);
    };

    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [isOpen, onOpenDropdown, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenDropdown?.(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenDropdown, setIsOpen]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && menuRef.current && isKeyboardNavigation) {
      setTimeout(() => {
        const realIndex = searchable ? highlightedIndex + 1 : highlightedIndex;
        const highlightedElement = menuRef.current?.querySelector(
          `li:nth-child(${realIndex + 1})`
        ) as HTMLElement;

        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 0);
    }
  }, [isOpen, highlightedIndex, searchable, isKeyboardNavigation]);

  return (
    <div className={`${dropdownClassName} ${disabled ? styles.disabled : ''}`} ref={dropdownRef}>
      {/* Input hidden para validación HTML nativa */}
      {required && (
        <input
          type="hidden"
          required={required}
          name={name}
          value={
            isMultiList
              ? (selected as Option[])?.length > 0
                ? 'valid'
                : ''
              : (selected as Option)?.value || ''
          }
          style={{ display: 'none' }}
        />
      )}

      {useHeaderAsTrigger && header ? (
        <div
          className={`${triggerClassName} ${isOpen ? activeClassName : ''}`}
          onClick={(e) => {
            // Solo hacer toggle si no se hace click en un input
            if (!(e.target as HTMLElement)?.closest('input, button')) {
              toggleDropdown();
            }
          }}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          aria-required={required}
          aria-label={name || 'Dropdown'}
          data-name={name}
        >
          {header({
            searchTerm,
            setSearchTerm,
            inputRef,
            onKeyDown: handleSearchKeyDown,
            close: () => setIsOpen(false),
          })}
        </div>
      ) : (
        <div
          className={`${triggerClassName} ${isOpen ? activeClassName : ''}`}
          onClick={toggleDropdown}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          aria-required={required}
          aria-label={name || 'Dropdown'}
          data-name={name}
        >
          {trigger(selected)}
          {!hideArrowIcon && (
            <span className={dropdownButtonToggleClassName} aria-hidden="true">
              <ArrowIcon
                className={`${dropdownIconClassName} ${isOpen ? dropdownIconOpenClassName : ''}`}
              />
            </span>
          )}
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="listbox"
            aria-multiselectable={isMultiList}
            ref={menuRef}
            style={menuPosition}
            className={menuClassName}
            initial={{
              opacity: 0,
              y: -5,
              scaleY: 0.8,
              transformOrigin: 'top',
            }}
            animate={{
              opacity: 1,
              y: 0,
              scaleY: 1,
              transformOrigin: 'top',
            }}
            exit={{
              opacity: 0,
              y: -5,
              scaleY: 0.95,
              transformOrigin: 'top',
            }}
            transition={{
              duration: 0.15,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Buscador al inicio del menú */}
            {searchable && (
              <div className={styles.searcher_container}>
                <div className={styles.searcher}>
                  <DropdownSearchInput
                    type="text"
                    placeholder={searcherPlaceholder}
                    value={searchTerm}
                    ref={inputRef}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleSearchKeyDown}
                    aria-label="Buscar opciones"
                  />
                </div>
              </div>
            )}
            {/* Header personalizado arriba del menú (solo si no se usa como trigger) */}
            {header && !useHeaderAsTrigger && (
              <div className={styles.header_container}>
                {header({
                  searchTerm,
                  setSearchTerm,
                  inputRef,
                  onKeyDown: handleSearchKeyDown,
                  close: () => setIsOpen(false),
                })}
              </div>
            )}
            {/* Contenedor de opciones con scroll */}
            <ul className={styles.options_container} role="list">
              {renderOptions()}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

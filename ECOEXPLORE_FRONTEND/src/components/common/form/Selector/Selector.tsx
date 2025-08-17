import { Dropdown } from '@/components/common/form';
import type { SelectorProps } from './Selector.types';
import { ArrowIcon } from '@/icons';
import styles from './Selector.module.css';
import dropdownStyles from '@/components/common/form/Dropdown/Dropdown.module.css';
import { useState } from 'react';

export default function Selector({
  value = undefined,
  searchable = false,
  options = [],
  isTextSelector = false,
  defaultValue = undefined,
  placeholder = 'Seleccione una opción',
  searcherPlaceholder = 'Buscar...',
  required = false,
  disabled = false,
  allowDeselect = false,
  className,
  customTriggerClassName,
  onSelect = () => {},
  onOpenDropdown,
  isLoading = false,
}: SelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOpenDropdown = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
    onOpenDropdown?.(isOpen);
  };

  // Determinar el placeholder dinámico
  const dynamicPlaceholder = isLoading ? 'Cargando...' : placeholder;
  const dynamicSearcherPlaceholder = isLoading ? 'Cargando...' : searcherPlaceholder;

  return (
    <Dropdown
      value={value}
      disabled={disabled || isLoading}
      options={options}
      defaultValue={defaultValue}
      searchable={searchable}
      searcherPlaceholder={dynamicSearcherPlaceholder}
      onSelect={onSelect}
      onOpenDropdown={handleOpenDropdown}
      allowDeselect={allowDeselect}
      required={required}
      dropdownClassName={`${(isTextSelector && styles.text_selector) || dropdownStyles.dropdown}  ${className || ''}`}
      trigger={(selected) => {
        if (Array.isArray(selected)) {
          return (
            <div className={styles.trigger_selector}>
              {selected.length > 0 ? (
                <p>{`${selected.length} options selected`}</p>
              ) : (
                <p className={styles.placeholder}>{dynamicPlaceholder}</p>
              )}
              {isTextSelector && (
                <ArrowIcon
                  className={`${dropdownStyles.dropdown_icon} ${
                    isDropdownOpen ? dropdownStyles.dropdown_icon_open : ''
                  }`}
                />
              )}
            </div>
          );
        }
        return (
          <div className={`${styles.trigger_selector} `}>
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
              <p className={styles.placeholder}>{dynamicPlaceholder}</p>
            )}
            {isTextSelector && (
              <ArrowIcon
                className={`${dropdownStyles.dropdown_icon} ${
                  isDropdownOpen ? dropdownStyles.dropdown_icon_open : ''
                }`}
              />
            )}
          </div>
        );
      }}
      triggerClassName={`${isTextSelector ? styles.trigger_text_selector : dropdownStyles.trigger} ${customTriggerClassName || ''}`}
      hideArrowIcon={isTextSelector}
    />
  );
}

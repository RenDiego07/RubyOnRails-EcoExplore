import { ReactNode } from 'react';
import { DropdownBaseProps } from '../Dropdown/Dropdown.types';

export interface SelectorOption {
  label: string;
  value: string | number;
  icon?: ReactNode;
  // Propiedades adicionales para selectores de países
  isoCode?: string;
  name?: string;
  phonecode?: string;
  phoneCode?: string;
  flag?: string;
  description?: string;
}

export interface SelectorProps extends DropdownBaseProps {
  value?: SelectorOption | null;
  searchable?: boolean;
  options?: SelectorOption[];
  isTextSelector?: boolean;
  defaultValue?: SelectorOption;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  allowDeselect?: boolean;
  className?: string;
  customTriggerClassName?: string;
  onSelect?: (option: SelectorOption | SelectorOption[] | null) => void;
  onOpenDropdown?: (isOpen: boolean) => void;
  isLoading?: boolean;
}

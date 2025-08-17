import type { ReactNode } from 'react';

export interface Option {
  label: string;
  value: string | number;
  groupIndex?: number;
  groupLabel?: string;
  icon?: ReactNode;
}

export interface DropdownBaseProps {
  value?: Option | Option[] | null;
  defaultValue?: Option | Option[] | null;
  name?: string;
  required?: boolean;
  trigger?: (selected: Option | Option[] | null) => ReactNode;
  header?: (args: {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    onKeyDown: (e: React.KeyboardEvent) => void;
    close: () => void;
  }) => ReactNode;
  useHeaderAsTrigger?: boolean;
  isOpen?: boolean;
  options?: Option[] | Option[][];
  groupLabels?: string[];
  onSelect?: (option: Option | Option[] | null) => void;
  onOpenDropdown?: (isOpen: boolean) => void;
  searchable?: boolean;
  placeholder?: string;
  searcherPlaceholder?: string;
  inputClearable?: boolean;
  dropdownClassName?: string;
  triggerClassName?: string;
  dropdownButtonToggleClassName?: string;
  dropdownIconClassName?: string;
  dropdownIconOpenClassName?: string;
  menuClassName?: string;
  menuItemClassName?: string;
  activeClassName?: string;
  selectedClassName?: string;
  highlightedClassName?: string;
  searcherClassName?: string;
  searcherInputClassName?: string;
  selectionEnabled?: boolean;
  allowDeselect?: boolean;
  visibleOptions?: number;
  hideArrowIcon?: boolean;
  noOptionsText?: string;
  noOptionsClassName?: string;
  disabled?: boolean;
}

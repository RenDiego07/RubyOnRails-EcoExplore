export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'search' | 'date';
  options?: FilterOption[];
  placeholder?: string;
}

export interface FiltersProps {
  fields: FilterField[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
}

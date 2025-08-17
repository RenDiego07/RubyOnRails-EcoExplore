import { ValidationRule } from '@/interfaces/ValidationRule';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validations?: ValidationRule[];
  className?: string;
  onErrorChange?: (error: string | null) => void;
}

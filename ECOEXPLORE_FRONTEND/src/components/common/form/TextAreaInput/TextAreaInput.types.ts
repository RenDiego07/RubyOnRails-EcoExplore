import { ValidationRule } from '@/interfaces/ValidationRule';

export interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  validations?: ValidationRule[];
  errorMessage?: string;
  onErrorChange?: (error: string | null) => void;
  showCharCount?: boolean;
}

import { LabelHTMLAttributes, ReactNode } from 'react';
export interface FormFieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label?: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'member';
  points: number;
  isActive: boolean;
}

export interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

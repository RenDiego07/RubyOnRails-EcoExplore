export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  points: number;
  profile_photo_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  role?: 'admin' | 'member' | 'all';
  status?: 'active' | 'inactive' | 'all';
  search?: string;
}

export interface UserActions {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onViewDetails: (user: User) => void;
}

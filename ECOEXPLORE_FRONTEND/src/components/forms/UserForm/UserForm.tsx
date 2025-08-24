import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import { UserFormProps, UserFormData } from './UserForm.types';
import styles from './UserForm.module.css';

export default function UserForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false,
  mode = 'create'
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'member',
    points: 0,
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || 'member',
        points: initialData.points || 0,
        isActive: initialData.isActive ?? true
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido' as any;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido' as any;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido' as any;
    }

    if (formData.points < 0) {
      newErrors.points = 'Los puntos no pueden ser negativos' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="name">
            Nombre *
          </label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ingrese el nombre completo"
          />
          {errors.name && (
            <span style={{ color: 'var(--danger)', fontSize: '14px' }}>
              {errors.name}
            </span>
          )}
        </div>

        <div className={styles.formField}>
          <label className={styles.label} htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && (
            <span style={{ color: 'var(--danger)', fontSize: '14px' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div className={styles.formField}>
          <label className={styles.label} htmlFor="role">
            Rol
          </label>
          <select
            id="role"
            className={styles.select}
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value as 'admin' | 'member')}
          >
            <option value="member">Miembro</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className={styles.formField}>
          <label className={styles.label} htmlFor="points">
            Puntos
          </label>
          <input
            id="points"
            type="number"
            className={styles.input}
            value={formData.points}
            onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
            min="0"
            placeholder="0"
          />
          {errors.points && (
            <span style={{ color: 'var(--danger)', fontSize: '14px' }}>
              {errors.points}
            </span>
          )}
        </div>

        <div className={`${styles.formField} ${styles.fullWidth}`}>
          <div className={styles.checkboxField}>
            <input
              id="isActive"
              type="checkbox"
              className={styles.checkbox}
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
            <label className={styles.label} htmlFor="isActive">
              Usuario activo
            </label>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button 
          type="button" 
          variant="tertiary" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
        >
          {mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}

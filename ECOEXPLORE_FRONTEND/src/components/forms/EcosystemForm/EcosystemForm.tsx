import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import { EcosystemFormProps } from './EcosystemForm.types';
import type { EcosystemFormData } from '@/types';
import styles from '../UserForm/UserForm.module.css'; // Reutilizamos los estilos

export default function EcosystemForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false,
  mode = 'create'
}: EcosystemFormProps) {
  const [formData, setFormData] = useState<EcosystemFormData>({
    name: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<EcosystemFormData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EcosystemFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido' as any;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida' as any;
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

  const handleInputChange = (field: keyof EcosystemFormData, value: any) => {
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
        <div className={`${styles.formField} ${styles.fullWidth}`}>
          <label className={styles.label} htmlFor="name">
            Nombre del Ecosistema *
          </label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ej: Bosque Tropical"
          />
          {errors.name && (
            <span style={{ color: 'var(--danger)', fontSize: '14px' }}>
              {errors.name}
            </span>
          )}
        </div>

        <div className={`${styles.formField} ${styles.fullWidth}`}>
          <label className={styles.label} htmlFor="description">
            Descripción *
          </label>
          <textarea
            id="description"
            className={styles.input}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descripción general del ecosistema..."
            rows={3}
          />
          {errors.description && (
            <span style={{ color: 'var(--danger)', fontSize: '14px' }}>
              {errors.description}
            </span>
          )}
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
          {mode === 'create' ? 'Crear Ecosistema' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}

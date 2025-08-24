import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import { SpeciesFormProps } from './SpeciesForm.types';
import type { SpeciesFormData } from '@/types';
import styles from '../UserForm/UserForm.module.css'; // Reutilizamos los estilos

export default function SpeciesForm({ 
  initialData, 
  typeSpecies,
  onSubmit, 
  onCancel, 
  loading = false,
  mode = 'create'
}: SpeciesFormProps) {
  const [formData, setFormData] = useState<SpeciesFormData>({
    id: '',
    name: '',
    type_specie_id: ''
  });

  const [errors, setErrors] = useState<Partial<SpeciesFormData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        name: initialData.name || '',
        type_specie_id: initialData.type_specie_id || ''
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SpeciesFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido' as any;
    }

    if (!formData.type_specie_id) {
      newErrors.type_specie_id = 'El tipo de especie es requerido' as any;
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

  const handleInputChange = (field: keyof SpeciesFormData, value: any) => {
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
            Nombre Común *
          </label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ej: Quetzal"
          />
          {errors.name && (
            <span style={{ color: 'var(--danger)', fontSize: '14px' }}>
              {errors.name}
            </span>
          )}
        </div>

        <div className={styles.formField}>
          <label className={styles.label} htmlFor="typeSpecieId">
            Tipo de Especie *
          </label>
          <select
            id="typeSpecieId"
            className={styles.select}
            value={formData.type_specie_id}
            onChange={(e) => handleInputChange('type_specie_id', e.target.value)}
          >
            <option value="">Seleccionar tipo...</option>
            {typeSpecies.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} ({type.code})
              </option>
            ))}
          </select>
          {errors.type_specie_id && (
            <span style={{ color: 'var(--danger)', fontSize: '14px' }}>
              {errors.type_specie_id}
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
          {mode === 'create' ? 'Crear Especie' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}

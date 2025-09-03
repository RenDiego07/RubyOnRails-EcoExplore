import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { SpeciesApprovalModalProps, SpeciesApprovalData } from './SpeciesApprovalModal.types';
import { Species, TypeSpecie } from '../../../../types/Species.types';
import { SpeciesService } from '../../../../services/CRUD/species/species.service';
import styles from './SpeciesApprovalModal.module.css';

export const SpeciesApprovalModal: React.FC<SpeciesApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  defaultSpecieName,
  loading = false,
}) => {
  const [action, setAction] = useState<'create' | 'select'>('create');
  const [speciesName, setSpeciesName] = useState(defaultSpecieName);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('');
  const [typeSpecieId, setTypeSpecieId] = useState('');
  const [existingSpecies, setExistingSpecies] = useState<Species[]>([]);
  const [typeSpecies, setTypeSpecies] = useState<TypeSpecie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAction('create');
      setSpeciesName(defaultSpecieName);
      setSelectedSpeciesId('');
      setTypeSpecieId('');
      setSearchTerm('');
      // TODO: Load existing species and type species
      loadSpeciesData();
    }
  }, [isOpen, defaultSpecieName]);

  const loadSpeciesData = async () => {
    try {
      const [speciesData, typeSpeciesData] = await Promise.all([
        SpeciesService.getSpecies(),
        SpeciesService.getTypeSpecies(),
      ]);

      if (speciesData) {
        setExistingSpecies(speciesData);
      }
      setTypeSpecies(typeSpeciesData);
    } catch (error) {
      console.error('Error loading species data:', error);
    }
  };

  const handleConfirm = () => {
    const data: SpeciesApprovalData = {
      action,
      speciesName: action === 'create' ? speciesName : undefined,
      selectedSpeciesId: action === 'select' ? selectedSpeciesId : undefined,
      typeSpecieId: action === 'create' ? typeSpecieId : undefined,
    };

    onConfirm(data);
  };

  const filteredSpecies = existingSpecies.filter((species) =>
    species.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFormValid = () => {
    if (action === 'create') {
      return speciesName.trim() !== '' && typeSpecieId !== '';
    } else {
      return selectedSpeciesId !== '';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Gestión de Especie"
      subtitle="Elige si crear una nueva especie o seleccionar una existente"
      onClose={onClose}
      hasActionButtons={false}
      size="medium"
      className={styles.modal}
    >
      <div className={styles.content}>
        <div className={styles.actionSelector}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="action"
              value="create"
              checked={action === 'create'}
              onChange={(e) => setAction(e.target.value as 'create' | 'select')}
              disabled={loading}
            />
            <span>Crear nueva especie</span>
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="action"
              value="select"
              checked={action === 'select'}
              onChange={(e) => setAction(e.target.value as 'create' | 'select')}
              disabled={loading}
            />
            <span>Seleccionar especie existente</span>
          </label>
        </div>

        {action === 'create' && (
          <div className={styles.createForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre de la Especie</label>
              <input
                type="text"
                value={speciesName}
                onChange={(e) => setSpeciesName(e.target.value)}
                placeholder="Ingresa el nombre de la especie"
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de Especie</label>
              <select
                value={typeSpecieId}
                onChange={(e) => setTypeSpecieId(e.target.value)}
                className={styles.select}
                disabled={loading}
              >
                <option value="">Selecciona un tipo</option>
                {typeSpecies.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {action === 'select' && (
          <div className={styles.selectForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Buscar Especie</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca la especie existente..."
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.speciesList}>
              {filteredSpecies.length > 0 ? (
                filteredSpecies.map((species) => (
                  <label key={species.id} className={styles.speciesOption}>
                    <input
                      type="radio"
                      name="selectedSpecies"
                      value={species.id}
                      checked={selectedSpeciesId === species.id}
                      onChange={(e) => setSelectedSpeciesId(e.target.value)}
                      disabled={loading}
                    />
                    <div className={styles.speciesInfo}>
                      <span className={styles.speciesName}>{species.name}</span>
                      <span className={styles.speciesType}>
                        {species.type_specie?.name || 'Sin tipo'}
                      </span>
                    </div>
                  </label>
                ))
              ) : (
                <p className={styles.noResults}>
                  {searchTerm ? 'No se encontraron especies' : 'Cargando especies...'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.cancelButton} onClick={onClose} disabled={loading}>
          Cancelar
        </button>
        <button
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={loading || !isFormValid()}
        >
          {loading ? 'Procesando...' : 'Confirmar'}
        </button>
      </div>
    </Modal>
  );
};

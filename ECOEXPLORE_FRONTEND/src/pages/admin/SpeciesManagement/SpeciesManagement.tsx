import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSpeciesManagement } from '@/hooks/useSpeciesManagement';
import { 
  Button, 
  Table, 
  Filters, 
  PageHeader, 
  Modal 
} from '@/components/common';
import { SpeciesForm } from '@/components/forms';
import type { 
  Species,
  SpeciesFilters
} from '@/types';
import type { 
  TableColumn, 
  TableAction,
  FilterField 
} from '@/components/common';
import type { SpeciesFormData } from '@/types';
import styles from './SpeciesManagement.module.css';

export default function SpeciesManagement() {
  const { logout } = useAuth();
  const { species, typeSpecies, loading, actionLoading, createSpecies, updateSpecies, deleteSpecies } = useSpeciesManagement();
  
  const [filters, setFilters] = useState<SpeciesFilters>({
    type_specie_id: 'all',
    search: ''
  });
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  console.log('Especies:', species);

  const handleCreateSpecies = async (formData: SpeciesFormData) => {
    try {
      await createSpecies(formData);
      setShowCreateModal(false);
      console.log('Especie creada exitosamente');
    } catch (error) {
      console.error('Error al crear la especie:', error);
    }
  };

  const handleEditSpecies = async (formData: SpeciesFormData) => {
    if (!selectedSpecies) return;
    
    try {
      await updateSpecies(selectedSpecies.id, formData);
      setShowEditModal(false);
      setSelectedSpecies(null);
      console.log('Especie actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la especie:', error);
    }
  };

  const handleDeleteSpecies = async () => {
    if (!selectedSpecies) return;
    
    try {
      await deleteSpecies(selectedSpecies.id);
      setShowDeleteModal(false);
      setSelectedSpecies(null);
      console.log('Especie eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la especie:', error);
    }
  };

  // Filter configuration
  const filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Buscar',
      type: 'search',
      placeholder: 'Buscar por nombre...'
    },
    {
      key: 'type_specie_id',
      label: 'Tipo de Especie',
      type: 'select',
      placeholder: 'Todos los tipos',
      options: [
        { value: 'all', label: 'Todos los tipos' },
        ...typeSpecies.map(type => ({ value: type.id, label: `${type.name} (${type.code})` }))
      ]
    }
  ];

  // Table columns configuration
  const columns: TableColumn<Species>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (value) => (
        <div>
          <div>{value as string}</div>
        </div>
      )
    },
    {
      key: 'type_specie',
      label: 'Tipo',
      sortable: true,
      render: (_, species) => (
        <span className={styles.typeBadge}>
          {typeSpecies.filter(type => type.id === species.type_specie_id).map(type => type.code)}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Fecha de Creación',
      sortable: true,
      render: (value) => (
        <span>{new Date(value as string).toLocaleDateString()}</span>
      )
    }
  ];

  // Table actions configuration
  const actions: TableAction<Species>[] = [
    {
      label: 'Editar',
      variant: 'primary',
      onClick: (species: Species) => {
        setSelectedSpecies(species);
        setShowEditModal(true);
      }
    },
    {
      label: 'Eliminar',
      variant: 'danger',
      onClick: (species: Species) => {
        setSelectedSpecies(species);
        setShowDeleteModal(true);
      }
    }
  ];

  // Filter and sort data
  const filteredSpecies = useMemo(() => {
    let filtered = species;

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.type_specie_id && filters.type_specie_id !== 'all') {
      filtered = filtered.filter(s => s.type_specie_id == filters.type_specie_id);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [species, filters, sortKey, sortDirection]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
      type_specie_id: 'all',
      search: ''
    });
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Gestión de Especies"
        subtitle="Administra las especies registradas en el sistema"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Gestión de Especies' }
        ]}
        actions={
          <>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Nueva Especie
            </Button>
            <Button variant="tertiary" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
        }
      />

      <div className={styles.content}>
        <Filters
          fields={filterFields}
          values={filters as Record<string, unknown>}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />

        <div className={styles.tableContainer}>
          <Table
            data={filteredSpecies}
            columns={columns}
            actions={actions}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            emptyMessage="No se encontraron especies"
            loading={loading}
          />
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          onClose={() => setShowCreateModal(false)}
          title="Crear Nueva Especie"
        >
          <SpeciesForm
            typeSpecies={typeSpecies}
            onSubmit={handleCreateSpecies}
            onCancel={() => setShowCreateModal(false)}
            loading={actionLoading}
            mode="create"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSpecies && (
        <Modal
          onClose={() => setShowEditModal(false)}
          title={`Editar Especie: ${selectedSpecies.name}`}
        >
          <SpeciesForm
            initialData={{
              id: selectedSpecies.id,
              name: selectedSpecies.name,
              type_specie_id: selectedSpecies.type_specie_id
            }}
            typeSpecies={typeSpecies}
            onSubmit={handleEditSpecies}
            onCancel={() => setShowEditModal(false)}
            loading={actionLoading}
            mode="edit"
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedSpecies && (
        <Modal
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminación"
        >
          <div style={{ padding: '20px' }}>
            <p>¿Estás seguro de que deseas eliminar la especie <strong>{selectedSpecies.name}</strong>?</p>
            <p style={{ color: 'var(--danger)', fontSize: '14px' }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button 
                variant="destructive" 
                onClick={handleDeleteSpecies}
                loading={actionLoading}
              >
                Eliminar Especie
              </Button>
              <Button 
                variant="tertiary" 
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

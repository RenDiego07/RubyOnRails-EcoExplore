import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEcosystemManagement } from '@/hooks/useEcosystemManagement';
import { 
  Button, 
  Table, 
  Filters, 
  PageHeader, 
  Modal 
} from '@/components/common';
import { EcosystemForm } from '@/components/forms';
import type { 
  Ecosystem,
  EcosystemFilters
} from '@/types';
import type { 
  TableColumn, 
  TableAction,
  FilterField 
} from '@/components/common';
import type { EcosystemFormData } from '@/types';
import styles from './EcosystemManagement.module.css';

export default function EcosystemManagement() {
  const { logout } = useAuth();
  const { ecosystems, loading, actionLoading, createEcosystem, updateEcosystem, deleteEcosystem } = useEcosystemManagement();
  
  const [filters, setFilters] = useState<EcosystemFilters>({
    search: ''
  });
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedEcosystem, setSelectedEcosystem] = useState<Ecosystem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleCreateEcosystem = async (formData: EcosystemFormData) => {
    try {
      await createEcosystem(formData);
      setShowCreateModal(false);
      console.log('Ecosistema creado exitosamente');
    } catch (error) {
      console.error('Error al crear el ecosistema:', error);
    }
  };

  const handleEditEcosystem = async (formData: EcosystemFormData) => {
    if (!selectedEcosystem) return;
    
    try {
      await updateEcosystem(selectedEcosystem.id, formData);
      setShowEditModal(false);
      setSelectedEcosystem(null);
      console.log('Ecosistema actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el ecosistema:', error);
    }
  };

  const handleDeleteEcosystem = async () => {
    if (!selectedEcosystem) return;
    
    try {
      await deleteEcosystem(selectedEcosystem.id);
      setShowDeleteModal(false);
      setSelectedEcosystem(null);
      console.log('Ecosistema eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el ecosistema:', error);
    }
  };

  // Filter configuration
  const filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Buscar',
      type: 'search',
      placeholder: 'Buscar por nombre o descripción...'
    }
  ];

  // Table columns configuration
  const columns: TableColumn<Ecosystem>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      width: '20%'
    },
    {
      key: 'description',
      label: 'Descripción',
      render: (value) => (
        <span className={styles.textTruncate} title={value}>
          {value}
        </span>
      ),
      width: '30%'
    },
    {
      key: 'characteristics',
      label: 'Características',
      render: (value) => (
        <span className={styles.textTruncate} title={value}>
          {value}
        </span>
      ),
      width: '30%'
    },
    {
      key: 'created_at',
      label: 'Fecha de Creación',
      sortable: true,
      render: (value) => (
        <span>{new Date(value as string).toLocaleDateString()}</span>
      ),
      width: '15%'
    }
  ];

  // Table actions configuration
  const actions: TableAction<Ecosystem>[] = [
    {
      label: 'Editar',
      variant: 'primary',
      onClick: (ecosystem: Ecosystem) => {
        setSelectedEcosystem(ecosystem);
        setShowEditModal(true);
      }
    },
    {
      label: 'Eliminar',
      variant: 'danger',
      onClick: (ecosystem: Ecosystem) => {
        setSelectedEcosystem(ecosystem);
        setShowDeleteModal(true);
      }
    }
  ];

  // Filter and sort data
  const filteredEcosystems = useMemo(() => {
    let filtered = ecosystems;

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        e.description.toLowerCase().includes(filters.search!.toLowerCase())
      );
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
  }, [ecosystems, filters, sortKey, sortDirection]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
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
        title="Gestión de Ecosistemas"
        subtitle="Configura y gestiona los ecosistemas del sistema"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Gestión de Ecosistemas' }
        ]}
        actions={
          <>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Nuevo Ecosistema
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
          values={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />

        <div className={styles.tableContainer}>
          <Table
            data={filteredEcosystems}
            columns={columns}
            actions={actions}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            emptyMessage="No se encontraron ecosistemas"
            loading={loading}
          />
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          onClose={() => setShowCreateModal(false)}
          title="Crear Nuevo Ecosistema"
        >
          <EcosystemForm
            onSubmit={handleCreateEcosystem}
            onCancel={() => setShowCreateModal(false)}
            loading={actionLoading}
            mode="create"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEcosystem && (
        <Modal
          onClose={() => setShowEditModal(false)}
          title={`Editar Ecosistema: ${selectedEcosystem.name}`}
        >
          <EcosystemForm
            initialData={{
              name: selectedEcosystem.name,
              description: selectedEcosystem.description
            }}
            onSubmit={handleEditEcosystem}
            onCancel={() => setShowEditModal(false)}
            loading={actionLoading}
            mode="edit"
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedEcosystem && (
        <Modal
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminación"
        >
          <div style={{ padding: '20px' }}>
            <p>¿Estás seguro de que deseas eliminar el ecosistema <strong>{selectedEcosystem.name}</strong>?</p>
            <p style={{ color: 'var(--danger)', fontSize: '14px' }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button 
                variant="destructive" 
                onClick={handleDeleteEcosystem}
                loading={actionLoading}
              >
                Eliminar Ecosistema
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

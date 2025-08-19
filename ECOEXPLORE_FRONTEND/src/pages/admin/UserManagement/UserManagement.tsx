import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserManagement } from '@/hooks/useUserManagement';
import { 
  Button, 
  Table, 
  Filters, 
  PageHeader, 
  Modal 
} from '@/components/common';
import { UserForm } from '@/components/forms';
import type { 
  User,
  UserFilters
} from '@/types';
import type { 
  TableColumn, 
  TableAction,
  FilterField 
} from '@/components/common';
import type { UserFormData } from '@/components/forms';
import styles from './UserManagement.module.css';

export default function UserManagement() {
  const { logout } = useAuth();
  const { users, loading, actionLoading, createUser, updateUser, deleteUser } = useUserManagement();
  
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    status: 'all',
    search: ''
  });
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter configuration
  const filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Buscar',
      type: 'search',
      placeholder: 'Buscar por nombre o email...'
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'select',
      placeholder: 'Todos los roles',
      options: [
        { value: 'all', label: 'Todos los roles' },
        { value: 'admin', label: 'Administrador' },
        { value: 'member', label: 'Miembro' }
      ]
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      placeholder: 'Todos los estados',
      options: [
        { value: 'all', label: 'Todos los estados' },
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' }
      ]
    }
  ];

  // Table columns configuration
  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      width: '200px'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '250px'
    },
    {
      key: 'role',
      label: 'Rol',
      render: (value: string) => (
        <span className={`${styles.roleBadge} ${styles[value]}`}>
          {value === 'admin' ? 'Administrador' : 'Miembro'}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'points',
      label: 'Puntos',
      render: (value: number) => (
        <span className={styles.pointsBadge}>{value}</span>
      ),
      sortable: true,
      width: '100px'
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value: boolean) => (
        <span className={`${styles.statusBadge} ${value ? styles.active : styles.inactive}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
      width: '120px'
    },
    {
      key: 'createdAt',
      label: 'Fecha de Registro',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
      sortable: true,
      width: '150px'
    }
  ];

  // Table actions configuration
  const actions: TableAction<User>[] = [
    {
      label: 'Editar',
      onClick: (user: User) => {
        setSelectedUser(user);
        setShowEditModal(true);
      },
      variant: 'primary'
    },
    {
      label: 'Eliminar',
      onClick: (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
      },
      variant: 'danger'
    }
  ];

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = !filters.search || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'active' && user.isActive) ||
        (filters.status === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
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
  }, [users, filters, sortKey, sortDirection]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
      role: 'all',
      status: 'all',
      search: ''
    });
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleLogout = () => {
    logout();
  };

  const handleCreateUser = async (formData: UserFormData) => {
    try {
      await createUser(formData);
      setShowCreateModal(false);
      console.log('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    }
  };

  const handleEditUser = async (formData: UserFormData) => {
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.id, formData);
      setShowEditModal(false);
      setSelectedUser(null);
      console.log('Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      console.log('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra y modera los usuarios del sistema"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Gestión de Usuarios' }
        ]}
        actions={
          <>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Nuevo Usuario
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
            data={filteredUsers}
            columns={columns}
            actions={actions}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            emptyMessage="No se encontraron usuarios"
            loading={loading}
          />
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          onClose={() => setShowCreateModal(false)}
          title="Crear Nuevo Usuario"
        >
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setShowCreateModal(false)}
            loading={actionLoading}
            mode="create"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <Modal
          onClose={() => setShowEditModal(false)}
          title={`Editar Usuario: ${selectedUser.name}`}
        >
          <UserForm
            initialData={{
              name: selectedUser.name,
              email: selectedUser.email,
              role: selectedUser.role,
              points: selectedUser.points,
              isActive: selectedUser.isActive
            }}
            onSubmit={handleEditUser}
            onCancel={() => setShowEditModal(false)}
            loading={actionLoading}
            mode="edit"
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <Modal
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminación"
        >
          <div style={{ padding: '20px' }}>
            <p>¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser.name}</strong>?</p>
            <p style={{ color: 'var(--danger)', fontSize: '14px' }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
                loading={actionLoading}
              >
                Eliminar Usuario
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

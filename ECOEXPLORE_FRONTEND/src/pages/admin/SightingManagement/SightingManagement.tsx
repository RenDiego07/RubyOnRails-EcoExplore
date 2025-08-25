import React, { useState } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Filters } from '../../../components/common/Filters';
import { Table } from '../../../components/common/Table';
import { SightingDetailModal } from '../../../components/common/Modals/SightingDetailModal';
import { SpeciesApprovalModal } from '../../../components/common/Modals/SpeciesApprovalModal';
import { useSightingManagement } from '../../../hooks/useSightingManagement';
import { TableColumn } from '../../../components/common/Table/Table.types';
import { FilterField } from '../../../components/common/Filters/Filters.types';
import styles from './SightingManagement.module.css';
import { SightingResponse } from '@/interfaces';

const SightingManagement: React.FC = () => {
  const {
    filteredSightings,
    loading,
    filters,
    selectedSighting,
    isSpeciesModalOpen,
    pendingSightingForApproval,
    handleFilterChange,
    handleFilterReset,
    handleRowClick,
    handleDetailModalClose,
    handleApprovalConfirm,
    handleRejectConfirm,
    handleSpeciesModalClose,
    handleSpeciesConfirm
  } = useSightingManagement();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Enhanced handleRowClick to also open modal
  const handleRowClickWithModal = (sighting: SightingResponse) => {
    handleRowClick(sighting);
    setIsDetailModalOpen(true);
  };

  // Enhanced handleDetailModalClose to also close modal
  const handleDetailModalCloseWithModal = () => {
    handleDetailModalClose();
    setIsDetailModalOpen(false);
  };

  // Table columns configuration - simplified
  const columns: TableColumn<SightingResponse>[] = [
    {
      key: 'specie',
      label: 'Especie',
      render: (value: unknown) => (
        <span className={styles.specieCell}>
          {(value as string) || 'No especificada'}
        </span>
      ),
      sortable: true,
      width: '200px'
    },
    {
      key: 'user_name',
      label: 'Usuario',
      render: (value: unknown, item: SightingResponse) => (
        <div className={styles.userInfo}>
          <span className={styles.userName}>{value as string}</span>
          <span className={styles.userEmail}>{item.user_email}</span>
        </div>
      ),
      sortable: true,
      width: '250px'
    },
    {
      key: 'ecosystem_name',
      label: 'Ecosistema',
      render: (value: unknown) => (
        <span className={styles.textTruncate} title={value as string}>
          {value as string}
        </span>
      ),
      sortable: true,
      width: '200px'
    },
    {
      key: 'location_name',
      label: 'Ubicación',
      render: (value: unknown) => (
        <span className={styles.textTruncate} title={value as string}>
          {value as string}
        </span>
      ),
      sortable: true,
      width: '200px'
    },
    {
      key: 'sighting_state_name',
      label: 'Estado',
      render: (value: unknown) => {
        const stateName = value as string;
        let statusClass = styles.pending;
        
        switch (stateName?.toLowerCase()) {
          case 'aprobado':
            statusClass = styles.approved;
            break;
          case 'rechazado':
            statusClass = styles.rejected;
            break;
          default:
            statusClass = styles.pending;
        }
        
        return (
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {stateName}
          </span>
        );
      },
      sortable: true,
      width: '120px'
    },
    {
      key: 'created_at',
      label: 'Fecha de Reporte',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('es-ES'),
      sortable: true,
      width: '150px'
    }
  ];

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      key: 'user_name',
      label: 'Usuario',
      type: 'search',
      placeholder: 'Buscar por nombre de usuario...'
    },
    {
      key: 'ecosystem_name',
      label: 'Ecosistema',
      type: 'search',
      placeholder: 'Buscar por ecosistema...'
    },
    {
      key: 'sighting_state_name',
      label: 'Estado',
      type: 'select',
      placeholder: 'Seleccionar estado...',
      options: [
        { value: '', label: 'Todos los estados' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'accepted', label: 'Aprobado' },
        { value: 'rejected', label: 'Rechazado' }
      ]
    },
    {
      key: 'specie',
      label: 'Especie',
      type: 'search',
      placeholder: 'Buscar por especie...'
    }
  ];


  return (
    <div className={styles.container}>
      <PageHeader
        title="Gestión de Avistamientos"
        subtitle="Administra los avistamientos reportados por los usuarios"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Avistamientos' }
        ]}
      />

      <div className={styles.content}>
        <Filters
          fields={filterFields}
          values={filters as unknown as Record<string, unknown>}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />

        <Table
          columns={columns}
          data={filteredSightings}
          loading={loading}
          onRowClick={handleRowClickWithModal}
        />
      </div>

      <SightingDetailModal
        sighting={selectedSighting}
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalCloseWithModal}
        onApprove={handleApprovalConfirm}
        onReject={handleRejectConfirm}
        loading={loading}
      />

      <SpeciesApprovalModal
        isOpen={isSpeciesModalOpen}
        onClose={handleSpeciesModalClose}
        onConfirm={handleSpeciesConfirm}
        defaultSpecieName={pendingSightingForApproval?.specie || ''}
        loading={loading}
      />
    </div>
  );
};

export default SightingManagement;

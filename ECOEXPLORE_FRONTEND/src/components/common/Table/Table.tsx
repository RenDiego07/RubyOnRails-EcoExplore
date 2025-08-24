import { Spinner } from '@/components/common';
import { TableProps } from './Table.types';
import styles from './Table.module.css';

export default function Table<T>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onSort,
  sortKey,
  sortDirection,
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;

    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const getSortClass = (key: string) => {
    if (sortKey !== key) return '';
    return sortDirection === 'asc' ? styles.asc : styles.desc;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <table className={styles.table}>
      <thead className={styles.tableHeader}>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`${styles.headerCell} ${
                column.sortable ? `${styles.sortable} ${getSortClass(column.key)}` : ''
              }`}
              style={{ width: column.width }}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              {column.label}
            </th>
          ))}
          {actions.length > 0 && <th className={styles.headerCell}>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className={styles.tableRow}>
            {columns.map((column) => (
              <td key={column.key} className={styles.tableCell}>
                {column.render
                  ? column.render((item as Record<string, unknown>)[column.key], item)
                  : String((item as Record<string, unknown>)[column.key] || '')}
              </td>
            ))}
            {actions.length > 0 && (
              <td className={styles.actionsCell}>
                <div className={styles.actions}>
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className={`${styles.actionButton} ${styles[action.variant || 'tertiary']}`}
                      onClick={() => action.onClick(item)}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

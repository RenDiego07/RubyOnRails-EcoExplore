import { FiltersProps, FilterField, FilterOption } from './Filters.types';
import styles from './Filters.module.css';

export default function Filters({ fields, values, onChange, onReset }: FiltersProps) {
  const handleInputChange = (key: string, value: string) => {
    onChange(key, value);
  };

  const renderField = (field: FilterField) => {
    const value = (values[field.key] as string) || '';

    switch (field.type) {
      case 'select':
        return (
          <select
            className={styles.filterSelect}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          >
            <option value="">{field.placeholder || 'Seleccionar...'}</option>
            {field.options?.map((option: FilterOption) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'search':
        return (
          <input
            type="text"
            className={styles.filterInput}
            placeholder={field.placeholder || 'Buscar...'}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className={styles.filterInput}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersGrid}>
        {fields.map((field) => (
          <div key={field.key} className={styles.filterField}>
            <label className={styles.filterLabel}>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className={styles.filtersActions}>
        <button className={styles.resetButton} onClick={onReset}>
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}

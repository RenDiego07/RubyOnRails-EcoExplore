class FixUserColumns < ActiveRecord::Migration[8.0]
  def change
    # Agregar columna name
    add_column :users, :name, :string
    
    # Agregar columna active
    add_column :users, :active, :boolean, default: true
    
    # Migrar datos existentes (si los hay)
    # Combinar first_name y last_name en name
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE users 
          SET name = CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))
          WHERE first_name IS NOT NULL OR last_name IS NOT NULL;
        SQL
      end
    end
    
    # Eliminar las columnas viejas
    remove_column :users, :first_name, :string
    remove_column :users, :last_name, :string
    
    # Hacer name obligatorio
    change_column_null :users, :name, false
    
    # Agregar índice único para email si no existe
    add_index :users, :email, unique: true, if_not_exists: true
  end
end

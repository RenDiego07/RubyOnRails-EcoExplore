class CreateTypeSpecies < ActiveRecord::Migration[8.0]
  def change
    create_table :type_species do |t|
      t.string :name, null: false, limit: 10g
      t.string :code, null: false, limit: 10

      t.timestamps
    end

    add_index :type_species, :code, unique: true
    add_index :type_species, :name, unique: true
  end
end



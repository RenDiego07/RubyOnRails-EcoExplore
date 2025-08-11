class CreateSpecies < ActiveRecord::Migration[8.0]
  def change
    create_table :species do |t|
      t.references :type_specie, null: false, foreign_key: { to_table: :type_species }
      t.string :name, null: false, limit: 40

      t.timestamps
    end

    add_index :species, [:type_specie_id, :name], unique: true
  end
end



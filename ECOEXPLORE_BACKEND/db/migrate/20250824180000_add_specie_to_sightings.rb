class AddSpecieToSightings < ActiveRecord::Migration[7.0]
  def change
    add_column :sightings, :specie, :string, limit: 50
  end
end

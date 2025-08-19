class AddInvasiveZoneToSightings < ActiveRecord::Migration[7.0]
  def change
    add_column :sightings, :is_invasive, :boolean, default: false, null: false
    add_column :sightings, :invasive_zone, :string
    add_index  :sightings, :is_invasive
  end
end
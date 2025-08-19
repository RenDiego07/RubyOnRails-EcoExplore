class AddIsInvasiveToSightings < ActiveRecord::Migration[8.0]
  def change
    add_column :sightings, :is_invasive, :boolean
  end
end

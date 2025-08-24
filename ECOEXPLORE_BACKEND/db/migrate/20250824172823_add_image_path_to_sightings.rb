class AddImagePathToSightings < ActiveRecord::Migration[8.0]
  def change
    add_column :sightings, :image_path, :string
  end
end

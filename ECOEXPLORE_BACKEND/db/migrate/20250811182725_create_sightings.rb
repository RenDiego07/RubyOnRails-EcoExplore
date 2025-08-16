class CreateSightings < ActiveRecord::Migration[8.0]
  def change
    create_table :sightings, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :ecosystem, null: false, foreign_key: true
      t.references :location, null: false, foreign_key: true
      t.references :sighting_state, null: false, foreign_key: true
      t.string :description

      t.timestamps
    end
  end
end

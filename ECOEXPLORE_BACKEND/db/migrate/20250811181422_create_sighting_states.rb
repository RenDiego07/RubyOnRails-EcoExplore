class CreateSightingStates < ActiveRecord::Migration[8.0]
  def change
    create_table :sighting_states do |t|
      t.string :name
      t.integer :code

      t.timestamps
    end
  end
end

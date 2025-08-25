class CreateRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :records, id: :uuid do |t|
      t.references :sighting, null: false, foreign_key: true, type: :uuid
      t.references :specie, null: false, foreign_key: true

      t.timestamps
    end
  end
end

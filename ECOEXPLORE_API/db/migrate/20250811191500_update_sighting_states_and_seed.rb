class UpdateSightingStatesAndSeed < ActiveRecord::Migration[8.0]
    class SightingStateRecord < ActiveRecord::Base
      self.table_name = "sighting_states"
    end
  
    STATES = [
      { name: "pending",  code: "PENDING" },
      { name: "accepted", code: "ACCEPTED" },
      { name: "rejected", code: "REJECTED" }
    ].freeze
  
    def up
      # Cambiar code a string para permitir valores como PENDING/ACCEPTED/REJECTED
      change_column :sighting_states, :code, :string
  
      add_index :sighting_states, :name, unique: true unless index_exists?(:sighting_states, :name)
      add_index :sighting_states, :code, unique: true unless index_exists?(:sighting_states, :code)
  
      STATES.each do |attrs|
        record = SightingStateRecord.find_or_initialize_by(code: attrs[:code])
        record.name = attrs[:name]
        record.save!(validate: false)
      end
    end
  
    def down
      SightingStateRecord.where(code: STATES.map { |s| s[:code] }).delete_all
  
      remove_index :sighting_states, column: :name if index_exists?(:sighting_states, :name)
      remove_index :sighting_states, column: :code if index_exists?(:sighting_states, :code)
  
      # Intento de revertir a integer si fuese necesario; ignora si no es posible por datos presentes
      begin
class SeedTypeSpecies < ActiveRecord::Migration[8.0]
  class TypeSpeciesRecord < ActiveRecord::Base
    self.table_name = "type_species"
  end

  ENTRIES = [
    { name: "native", code: "NATIVE" },
    { name: "invase", code: "INVASE" }
  ].freeze

  def up
    ENTRIES.each do |attrs|
      record = TypeSpeciesRecord.find_or_initialize_by(code: attrs[:code])
      record.name = attrs[:name]
      record.save!(validate: false)
    end
  end

  def down
    TypeSpeciesRecord.where(code: ENTRIES.map { |e| e[:code] }).delete_all
  end
end



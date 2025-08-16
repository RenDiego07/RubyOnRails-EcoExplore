class TypeSpecie < ApplicationRecord
  self.table_name = "type_species"

  has_many :species, class_name: "Specie", foreign_key: :type_specie_id, inverse_of: :type_specie, dependent: :restrict_with_exception

  validates :name, presence: true, length: { maximum: 10 }
  validates :code, presence: true, length: { maximum: 10 }, uniqueness: true
end



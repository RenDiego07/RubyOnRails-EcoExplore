class Specie < ApplicationRecord
  self.table_name = "species"

  belongs_to :type_specie, class_name: "TypeSpecie", inverse_of: :species
  has_many :records, dependent: :destroy

  validates :name, presence: true, length: { maximum: 40 }
end



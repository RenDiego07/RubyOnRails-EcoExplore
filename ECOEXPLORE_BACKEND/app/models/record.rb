class Record < ApplicationRecord
  belongs_to :sighting
  belongs_to :specie
end

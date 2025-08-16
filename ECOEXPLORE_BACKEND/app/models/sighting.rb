class Sighting < ApplicationRecord
  belongs_to :user
  belongs_to :ecosystem
  belongs_to :location
  belongs_to :sighting_state

  validates :ecosystem, :location, :sighting_state, presence: true
  validates :description, length: { maximum: 500 }, allow_blank: true
end

class User < ApplicationRecord
  has_secure_password
  
  has_many :sightings, dependent: :destroy
  
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2 }
  validates :role, presence: true, inclusion: { in: %w[admin user moderator] }
  
  enum role: { user: 0, moderator: 1, admin: 2 }
  
  scope :active, -> { where(active: true) }
end

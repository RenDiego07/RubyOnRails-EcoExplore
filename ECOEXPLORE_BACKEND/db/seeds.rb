# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# --- Estados de avistamiento (semilla mínima) ---
# Ajusta los codes/names si en tu app usas otros
pending  = SightingState.find_or_create_by!(code: "PENDING")  { |s| s.name = "Pending Review" }
approved = SightingState.find_or_create_by!(code: "APPROVED") { |s| s.name = "Approved" }
rejected = SightingState.find_or_create_by!(code: "REJECTED") { |s| s.name = "Rejected" }

# --- Ecosistema & ubicación demo ---
eco = Ecosystem.find_or_create_by!(name: "Bosque Seco") do |e|
  e.description = "Demo ecosystem"
end

loc = Location.find_or_create_by!(name: "Laguna del Este") do |l|
  l.coordinates = "-2.1900,-79.8800"
end

# --- Admin demo ---
admin = User.find_or_create_by!(email: "admin@example.com") do |u|
  u.name = "Admin"
  u.password = "Secret123!"
  u.role = "admin"
  u.active = true
end

# --- Sighting DEMO (ya con estado) ---
Sighting.find_or_create_by!(
  description: "Rana Toro demo",
  user_id: admin.id,
  ecosystem_id: eco.id,
  location_id: loc.id,
  sighting_state_id: approved.id # <- CLAVE: asignar estado
) do |s|
  s.is_invasive   = false
  s.invasive_zone = nil
end

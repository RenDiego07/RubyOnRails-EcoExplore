# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_11_193500) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "ecosystems", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "locations", force: :cascade do |t|
    t.string "name"
    t.string "coordinates"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sighting_states", force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_sighting_states_on_code", unique: true
    t.index ["name"], name: "index_sighting_states_on_name", unique: true
  end

  create_table "sightings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.bigint "ecosystem_id", null: false
    t.bigint "location_id", null: false
    t.bigint "sighting_state_id", null: false
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ecosystem_id"], name: "index_sightings_on_ecosystem_id"
    t.index ["location_id"], name: "index_sightings_on_location_id"
    t.index ["sighting_state_id"], name: "index_sightings_on_sighting_state_id"
    t.index ["user_id"], name: "index_sightings_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "points"
    t.string "role"
    t.string "password_digest"
    t.string "name", null: false
    t.boolean "active", default: true
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "sightings", "ecosystems"
  add_foreign_key "sightings", "locations"
  add_foreign_key "sightings", "sighting_states"
  add_foreign_key "sightings", "users"
end

class SightingResponse < BaseDto
  attr_accessor :id, :description, :location_name, :coordinates, :image_path, 
                :specie, :ecosystem_id, :ecosystem_name, :user_id, :user_name,
                :sighting_state_id, :state_code, :state_description, :created_at

  def initialize(sighting)
    @id = sighting.id
    @description = sighting.description
    @location_name = sighting.location_name
    @coordinates = sighting.coordinates
    @image_path = sighting.image_path
    @specie = sighting.specie
    @ecosystem_id = sighting.ecosystem_id
    @ecosystem_name = sighting.ecosystem&.name
    @user_id = sighting.user_id
    @user_name = sighting.user&.name
    @sighting_state_id = sighting.sighting_state_id
    @state_code = sighting.sighting_state&.code
    @state_description = sighting.sighting_state&.description
    @created_at = sighting.created_at
  end

  def as_json(options = {})
    {
      id: @id,
      description: @description,
      location_name: @location_name,
      coordinates: @coordinates,
      image_path: @image_path,
      specie: @specie,
      ecosystem: {
        id: @ecosystem_id,
        name: @ecosystem_name
      },
      user: {
        id: @user_id,
        name: @user_name
      },
      sighting_state: {
        id: @sighting_state_id,
        code: @state_code,
        description: @state_description
      },
      created_at: @created_at
    }
  end
end

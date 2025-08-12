class SightingsController < ApplicationController


  # POST /sightings
  def create
    result = SightingService.create(user: current_user, params: creation_params)
    if result.success
      render json: sighting_response(result.sighting), status: :created
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end

  private

  def creation_params
    params.permit(:ecosystem_id, :sighting_state_id, :sighting_state_code, :description, :location_name, :coordinates)
  end


  def sighting_response(sighting)
    {
      id: sighting.id,
      user_id: sighting.user_id,
      ecosystem_id: sighting.ecosystem_id,
      location_id: sighting.location_id,
      sighting_state_id: sighting.sighting_state_id,
      sighting_state_name: sighting.sighting_state.name,
      sighting_location: sighting.location.name,
      sighting_location_coordinates: sighting.location.coordinates,
      description: sighting.description,
      created_at: sighting.created_at
    }
  end
end



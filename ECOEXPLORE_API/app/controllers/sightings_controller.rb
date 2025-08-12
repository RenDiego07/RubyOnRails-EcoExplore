class SightingsController < ApplicationController


  # GET /sightings
  def index
    sightings = Sighting.includes(:sighting_state, :location, :ecosystem, :user).all
    render json: sightings.map { |s| sighting_response(s) }, status: :ok
  end
  
  
  def create
    result = SightingService.create(user: current_user, params: creation_params)
    if result.success
      render json: sighting_response(result.sighting), status: :created
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end

  def update
    sighting_id = params[:id].presence || params[:sighting_id]
    result = SightingService.update_state(user: current_user, sighting_id: sighting_id, params: update_params)

    if result.success
      render json: sighting_response(result.sighting), status: :ok
    else
      status = result.error.to_s.downcase == 'unauthorized' ? :unauthorized : :unprocessable_entity
      render json: { error: result.error }, status: status
    end
  end

  private

  def creation_params
    params.permit(:ecosystem_id, :sighting_state_id, :sighting_state_code, :description, :location_name, :coordinates)
  end

  def update_params
    params.permit(:sighting_state_id, :sighting_state_code)
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



class SightingsController < ApplicationController
  wrap_parameters false
  
  # GET /sightings - Todos los sightings (admin)
  def index
    result = SightingService.get_all
    if result.success
      render json: result.sightings.map { |s| sighting_response(s) }, status: :ok
    else
      render json: { error: result.error }, status: :internal_server_error
    end
  end

  # GET /sightings/my_sightings - Sightings del usuario actual
  def my_sightings
    result = SightingService.get_user_sightings(user: current_user)
    if result.success
      render json: result.sightings.map { |s| sighting_response(s) }, status: :ok
    else
      render json: { error: result.error }, status: :internal_server_error
    end
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

  def updateState
    result = SightingService.update_state(user: current_user, sighting_id: params[:id], params: { sighting_state_code: params[:sighting_state_code], specie_id: params[:specie_id] })
    if result.success
      render json: sighting_response(result.sighting), status: :ok
    else
      status = result.error.to_s.downcase == 'unauthorized' ? :unauthorized : :unprocessable_entity
      render json: { error: result.error }, status: status
    end
  end

  private

  def creation_params
    params.permit(:ecosystem_id, :description, :location_name, :coordinates, :image_path, :specie)
  end

  def update_params
    params.permit(:sighting_state_id, :sighting_state_code)
  end

  def updateState_params
    params.permit(:sighting_state_code, :specie_id)
  end

  def sighting_response(sighting)
    {
      id: sighting.id,
      user_id: sighting.user_id,
      user_name: sighting.user.name,
      user_email: sighting.user.email,
      ecosystem_id: sighting.ecosystem_id,
      ecosystem_name: sighting.ecosystem.name,
      location_id: sighting.location_id,
      location_name: sighting.location.name,
      sighting_state_id: sighting.sighting_state_id,
      sighting_state_name: sighting.sighting_state.name,
      sighting_location: sighting.location.name,
      sighting_location_coordinates: sighting.location.coordinates,
      description: sighting.description,
      image_path: sighting.image_path,
      specie: sighting.specie,
      created_at: sighting.created_at
    }
  end
end



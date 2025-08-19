class SightingsController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin!, only: :mark_invasive

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

  # PUT /sightings/:id/mark_invasive
  def mark_invasive
    zone = params.require(:invasive_zone).to_s.strip
    return render json: { error: "invasive_zone is required" }, status: :bad_request if zone.blank?

    s = Sighting.find(params[:id])
    s.update!(is_invasive: true, invasive_zone: zone)

    render json: {
      message: "Species marked as invasive",
      sighting: { id: s.id, is_invasive: s.is_invasive, invasive_zone: s.invasive_zone }
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Sighting not found" }, status: :not_found
  end

  # GET /sightings/invasive
  def invasive
    data = Sighting.includes(:ecosystem, :location).where(is_invasive: true).map { |s|
      {
        id: s.id,
        description: s.description,
        invasive_zone: s.invasive_zone,
        ecosystem: s.ecosystem&.name,
        location:  s.location&.name,
        reported_at: s.created_at
      }
    }
    render json: { count: data.size, data: data }, status: :ok
  end

  private

  def authorize_admin!
    render(json: { error: "Unauthorized" }, status: :unauthorized) unless @current_user&.role == "admin"
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



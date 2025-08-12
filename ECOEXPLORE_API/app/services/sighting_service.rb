class SightingService
  Result = Struct.new(:success, :sighting, :error, keyword_init: true)

  def self.create(user:, params:)
    ActiveRecord::Base.transaction do
      sighting_state = resolve_state(params)
      ecosystem = Ecosystem.find(params[:ecosystem_id])

      location = find_or_create_location(
        name: params[:location_name],
        coordinates: params[:coordinates]
      )

      sighting = user.sightings.new(
        ecosystem: ecosystem,
        location: location,
        sighting_state: sighting_state,
        description: params[:description]
      )

      if sighting.save
        return Result.new(success: true, sighting: sighting)
      else
        raise ActiveRecord::Rollback, sighting.errors.full_messages.join(", ")
      end
    end
  rescue ActiveRecord::RecordNotFound => e
    Result.new(success: false, error: e.message)
  rescue StandardError => e
    Result.new(success: false, error: e.message)
  end

  def self.resolve_state(params)
    if params[:sighting_state_id].present?
      SightingState.find(params[:sighting_state_id])
    elsif params[:sighting_state_code].present?
      SightingState.find_by!(code: params[:sighting_state_code].to_s.upcase)
    else
      raise ArgumentError, "Missing sighting_state_id or sighting_state_code"
    end
  end
  private_class_method :resolve_state

  def self.find_or_create_location(name:, coordinates:)
    raise ArgumentError, "location_name is required" if name.blank?
    raise ArgumentError, "coordinates are required" if coordinates.blank?

    Location.find_or_create_by!(name: name, coordinates: coordinates)
  end
  private_class_method :find_or_create_location
end



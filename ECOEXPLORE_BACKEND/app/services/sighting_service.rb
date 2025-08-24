class SightingService
  Result = Struct.new(:success, :sighting, :sightings, :error, keyword_init: true)

  def self.create(user:, params:)
    Rails.logger.info "🔍 SightingService.create params: #{params.inspect}"
    
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
        description: params[:description],
        image_path: params[:image_path],
        specie: params[:specie]
      )
      
      Rails.logger.info "🔍 Sighting antes de guardar: #{sighting.attributes.inspect}"

      if sighting.save
        Rails.logger.info "✅ Sighting guardado exitosamente con ID: #{sighting.id}"
        return Result.new(success: true, sighting: sighting)
      else
        Rails.logger.error "❌ Error al guardar sighting: #{sighting.errors.full_messages}"
        return Result.new(success: false, error: sighting.errors.full_messages.join(", "))
      end
    end
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "❌ RecordNotFound: #{e.message}"
    Result.new(success: false, error: e.message)
  rescue StandardError => e
    Rails.logger.error "❌ StandardError: #{e.message}"
    Result.new(success: false, error: e.message)
  end

  # Get all sightings (admin)
  def self.get_all
    Rails.logger.info "🔍 SightingService.get_all"
    begin
      sightings = Sighting.includes(:sighting_state, :location, :ecosystem, :user).order(created_at: :desc)
      Result.new(success: true, sightings: sightings)
    rescue StandardError => e
      Rails.logger.error "❌ Error getting all sightings: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  # Get user's sightings
  def self.get_user_sightings(user:)
    Rails.logger.info "🔍 SightingService.get_user_sightings for user_id: #{user.id}"
    begin
      sightings = user.sightings.includes(:sighting_state, :location, :ecosystem).order(created_at: :desc)
      Result.new(success: true, sightings: sightings)
    rescue StandardError => e
      Rails.logger.error "❌ Error getting user sightings: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  # Update sighting state (admin-only)
  def self.update_state(user:, sighting_id:, params:)
    return Result.new(success: false, error: 'Unauthorized') unless user&.role == 'admin'

    ActiveRecord::Base.transaction do
      sighting = Sighting.find(sighting_id)
      new_state = resolve_state(params)

      sighting.update!(sighting_state: new_state)

      Result.new(success: true, sighting: sighting)
    end
  rescue ActiveRecord::RecordNotFound => e
    Result.new(success: false, error: e.message)
  rescue ActiveRecord::RecordInvalid => e
    Result.new(success: false, error: e.record.errors.full_messages.join(", "))
  rescue ArgumentError => e
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
      # Asignar automáticamente el estado "pending" por defecto
      SightingState.find_by!(code: 'PENDING')
    end
  end
  private_class_method :resolve_state

  def self.find_or_create_location(name:, coordinates:)
    raise ArgumentError, "location_name is required" if name.blank?
    ##
    # Las coordenadas son opcionales
    coords = coordinates.present? ? coordinates : nil
    Location.find_or_create_by!(name: name, coordinates: coords)
  end
  private_class_method :find_or_create_location
end



class UserSpeciesService
  Result = Struct.new(:success, :species, :error, keyword_init: true)

  # Get species contributed by a specific user through approved sightings
  def self.get_user_contributed_species(user:)
    Rails.logger.info "🔍 UserSpeciesService.get_user_contributed_species for user_id: #{user.id}"
    
    begin
      # Get all species that have records from sightings by this user
      # Since records are only created for approved sightings, we don't need to check state
      species = Specie.joins(records: { sighting: :user })
                      .where(sightings: { user_id: user.id })
                      .includes(:type_specie, records: { sighting: [:location, :ecosystem] })
                      .distinct

      Rails.logger.info "✅ Found #{species.count} contributed species for user #{user.id}"
      Result.new(success: true, species: species)
      
    rescue StandardError => e
      Rails.logger.error "❌ Error getting user contributed species: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  # Get all species contributed by all users (admin view)
  def self.get_all_contributed_species
    Rails.logger.info "🔍 UserSpeciesService.get_all_contributed_species"
    
    begin
      # Get all species that have records (records are only created for approved sightings)
      species = Specie.joins(records: { sighting: :user })
                      .includes(:type_specie, records: { sighting: [:location, :ecosystem, :user] })
                      .distinct

      Rails.logger.info "✅ Found #{species.count} total contributed species"
      Result.new(success: true, species: species)
      
    rescue StandardError => e
      Rails.logger.error "❌ Error getting all contributed species: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  # Get detailed information about a user's contributed species including sighting details
  def self.get_user_species_with_sighting_details(user:)
    Rails.logger.info "🔍 UserSpeciesService.get_user_species_with_sighting_details for user_id: #{user.id}"
    
    begin
      # Get species with their sighting details for this user
      # Records are only created for approved sightings, so we don't need to check state
      records = Record.joins(:specie, sighting: :user)
                      .where(sightings: { user_id: user.id })
                      .includes(:specie, sighting: [:location, :ecosystem])

      # Group by species and collect sighting information
      species_data = records.group_by(&:specie).map do |specie, specie_records|
        # Get the most recent sighting for this species by this user
        latest_sighting = specie_records.map(&:sighting).max_by(&:created_at)
        
        {
          specie: specie,
          sighting: latest_sighting,
          total_sightings: specie_records.count
        }
      end

      Rails.logger.info "✅ Found #{species_data.count} species with sighting details for user #{user.id}"
      Result.new(success: true, species: species_data)
      
    rescue StandardError => e
      Rails.logger.error "❌ Error getting user species with sighting details: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end
end

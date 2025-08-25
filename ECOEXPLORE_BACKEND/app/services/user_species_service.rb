class UserSpeciesService
  Result = Struct.new(:success, :species, :error, keyword_init: true)

  def self.get_user_contributed_species(user:)
    Rails.logger.info "UserSpeciesService.get_user_contributed_species for user_id: #{user.id}"
    
    begin
      species = Specie.joins(records: { sighting: :user })
                      .where(sightings: { user_id: user.id })
                      .includes(:type_specie, records: { sighting: [:location, :ecosystem] })
                      .distinct

      Rails.logger.info "Found #{species.count} contributed species for user #{user.id}"
      Result.new(success: true, species: species)
      
    rescue StandardError => e
      Rails.logger.error "Error getting user contributed species: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  def self.get_all_contributed_species
    Rails.logger.info "UserSpeciesService.get_all_contributed_species"
    
    begin
      species = Specie.joins(records: { sighting: :user })
                      .includes(:type_specie, records: { sighting: [:location, :ecosystem, :user] })
                      .distinct

      Rails.logger.info "Found #{species.count} total contributed species"
      Result.new(success: true, species: species)
      
    rescue StandardError => e
      Rails.logger.error "Error getting all contributed species: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  def self.get_user_species_with_sighting_details(user:)
    Rails.logger.info "UserSpeciesService.get_user_species_with_sighting_details for user_id: #{user.id}"
    
    begin
      records = Record.joins(:specie, sighting: :user)
                      .where(sightings: { user_id: user.id })
                      .includes(:specie, sighting: [:location, :ecosystem])

      species_data = records.group_by(&:specie).map do |specie, specie_records|
        latest_sighting = specie_records.map(&:sighting).max_by(&:created_at)
        
        {
          specie: specie,
          sighting: latest_sighting,
          total_sightings: specie_records.count
        }
      end

      Rails.logger.info "Found #{species_data.count} species with sighting details for user #{user.id}"
      Result.new(success: true, species: species_data)
      
    rescue StandardError => e
      Rails.logger.error "Error getting user species with sighting details: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  def self.get_all_species_with_sighting_details
    Rails.logger.info "UserSpeciesService.get_all_species_with_sighting_details"
    
    begin
      records = Record.joins(:specie, :sighting)
                      .includes(:specie, sighting: [:location, :ecosystem, :user])

      species_data = records.group_by(&:specie).map do |specie, specie_records|
        latest_sighting = specie_records.map(&:sighting).max_by(&:created_at)
        
        {
          specie: specie,
          sighting: latest_sighting,
          total_sightings: specie_records.count
        }
      end

      Rails.logger.info "Found #{species_data.count} species with sighting details for public exploration"
      Result.new(success: true, species: species_data)
      
    rescue StandardError => e
      Rails.logger.error "Error getting all species with sighting details: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end
end

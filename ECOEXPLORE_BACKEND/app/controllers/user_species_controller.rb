class UserSpeciesController < ApplicationController
  wrap_parameters false

  # GET /user_species/my_contributed_species - Get species contributed by current user
  def my_contributed_species
    result = UserSpeciesService.get_user_species_with_sighting_details(user: current_user)
    
    if result.success
      render json: result.species.map { |data| contributed_species_response(data) }, status: :ok
    else
      render json: { error: result.error }, status: :internal_server_error
    end
  end

  # GET /user_species/all_contributed_species - Get all contributed species (admin only)
  def all_contributed_species
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user&.role == 'admin'
    
    result = UserSpeciesService.get_all_contributed_species
    
    if result.success
      render json: result.species.map { |specie| basic_species_response(specie) }, status: :ok
    else
      render json: { error: result.error }, status: :internal_server_error
    end
  end

  private

  def contributed_species_response(species_data)
    specie = species_data[:specie]
    sighting = species_data[:sighting]
    
    {
      id: specie.id,
      name: specie.name,
      description: sighting.description, # Use sighting description since specie doesn't have description
      type_specie_id: specie.type_specie_id,
      type_specie_name: specie.type_specie.name,
      type_specie_code: specie.type_specie.code,
      # Sighting details for this contributed species
      location: sighting.location.name,
      location_coordinates: sighting.location.coordinates,
      ecosystem_name: sighting.ecosystem.name,
      sighting_description: sighting.description,
      image_path: sighting.image_path,
      specie_field: sighting.specie, # This is the free text field from sighting
      contributed_date: sighting.created_at,
      total_sightings: species_data[:total_sightings]
    }
  end

  def basic_species_response(specie)
    {
      id: specie.id,
      name: specie.name,
      description: nil, # Specie model doesn't have description field
      type_specie_id: specie.type_specie_id,
      type_specie_name: specie.type_specie.name,
      type_specie_code: specie.type_specie.code,
      created_at: specie.created_at,
      updated_at: specie.updated_at
    }
  end
end

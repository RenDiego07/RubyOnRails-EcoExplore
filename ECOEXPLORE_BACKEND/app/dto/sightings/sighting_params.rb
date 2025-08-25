class SightingParams
  include ActiveModel::Model
  include ActiveModel::Attributes

  def self.creation_params
    [
      :ecosystem_id,
      :description,
      :location_name,
      :coordinates,
      :image_path,
      :specie
    ]
  end

  def self.update_params
    [
      :sighting_state_id,
      :sighting_state_code
    ]
  end

  def self.permit_creation_params(params)
    params.permit(*creation_params)
  end

  def self.permit_update_params(params)
    params.permit(*update_params)
  end
end

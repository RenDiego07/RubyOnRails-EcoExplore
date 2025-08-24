class BaseDto
  include ActiveModel::Model
  include ActiveModel::Attributes
  include ActiveModel::Serialization

  # Método base para convertir una colección de objetos
  def self.from_collection(collection)
    collection.map { |item| new(item) }
  end

  # Método base para serialización JSON
  def as_json(options = {})
    super(options)
  end
end

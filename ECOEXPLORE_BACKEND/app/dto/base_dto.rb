class BaseDto
  include ActiveModel::Model
  include ActiveModel::Attributes
  include ActiveModel::Serialization

  def self.from_collection(collection)
    collection.map { |item| new(item) }
  end

  def as_json(options = {})
    super(options)
  end
end

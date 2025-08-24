class TypeSpecieController < ApplicationController
  def index
    type_species = TypeSpecie.all
    render json: type_species
  end
end

class SpeciesController < ApplicationController
  def getSpecies
    species = Specie.all
    render json: species
  end

  def deleteSpecies
    species = Specie.find(params[:id])
    species.destroy
    head :no_content
  end

  def update
  end
end

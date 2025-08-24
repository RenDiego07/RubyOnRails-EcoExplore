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

  def updateSpecies
    species = Specie.find(params[:id])
    if species.update(updateParams)
      render json: species
    else
      render json: { errors: species.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
  
def updateParams
  params.permit(:id, :name, :type_specie_id)
end
class SpeciesController < ApplicationController
  def getSpecies
    species = Specie.all
    render json: species
  end

  def create
    species = Specie.new(createParams)
    if species.save
      render json: species, status: :created
    else
      render json: { errors: species.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def deleteSpecies
    species = Specie.find(params[:id])
    
    if species.destroy
      head :no_content
    else
      render json: { errors: species.errors.full_messages }, status: :unprocessable_entity
    end
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

private

def createParams
  params.permit(:name, :type_specie_id)
end

def updateParams
  params.permit(:id, :name, :type_specie_id)
end
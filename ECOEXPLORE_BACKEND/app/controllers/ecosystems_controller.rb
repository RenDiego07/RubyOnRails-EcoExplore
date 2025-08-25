class EcosystemsController < ApplicationController
  before_action :set_ecosystem, only: [:show, :update, :destroy]

  def index
    ecosystems = Ecosystem.all.order(:name)
    render json: ecosystems.map { |ecosystem| ecosystem_response(ecosystem) }
  end

  def show
    render json: ecosystem_response(@ecosystem)
  end

  def create
    ecosystem = Ecosystem.new(ecosystem_params)
    
    if ecosystem.save
      render json: ecosystem_response(ecosystem), status: :created
    else
      render json: { errors: ecosystem.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @ecosystem.update(ecosystem_params)
      render json: ecosystem_response(@ecosystem)
    else
      render json: { errors: @ecosystem.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @ecosystem.destroy
    head :no_content
  end

  private

  def set_ecosystem
    @ecosystem = Ecosystem.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Ecosystem not found' }, status: :not_found
  end

  def ecosystem_params
    params.permit(:name, :description)
  end

  def ecosystem_response(ecosystem)
    {
      id: ecosystem.id,
      name: ecosystem.name,
      description: ecosystem.description,
      created_at: ecosystem.created_at,
      updated_at: ecosystem.updated_at
    }
  end
end
class UserController < ApplicationController
  # Métodos existentes (no modificar - pertenecen a otro desarrollador)
  def getUsers
    users = User.all
    render json: users
  end

  def deleteUser
    user = User.find(params[:id])
    user.destroy
    head :no_content
  end

  # Nuevos métodos para perfil de usuario
  
  # GET /user/profile - Obtener perfil del usuario actual
  def profile
    result = UserService.get_profile(user: current_user)
    if result.success
      render json: user_response(result.user), status: :ok
    else
      render json: { error: result.error }, status: :internal_server_error
    end
  end

  # PATCH /user/profile - Actualizar perfil del usuario actual
  def update_profile
    result = UserService.update_profile(user: current_user, params: profile_params)
    if result.success
      render json: user_response(result.user), status: :ok
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end

  # PATCH /user/profile_photo - Actualizar foto de perfil
  def update_profile_photo
    unless params[:profile_photo_url].present?
      return render json: { error: 'profile_photo_url is required' }, status: :bad_request
    end

    result = UserService.update_profile_photo(
      user: current_user, 
      photo_url: params[:profile_photo_url]
    )
    
    if result.success
      render json: user_response(result.user), status: :ok
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.permit(:name, :email, :profile_photo_url, :current_password, :new_password)
  end

  def user_response(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      profile_photo_url: user.profile_photo_url,
      points: user.points || 0,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  end
end
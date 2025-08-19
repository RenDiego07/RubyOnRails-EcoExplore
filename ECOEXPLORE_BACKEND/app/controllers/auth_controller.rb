class AuthController < ApplicationController
  skip_before_action :authenticate_request
  
  def register
    user = User.new(user_params)
    user.role = 'member' unless user.role.present?
    
    if user.save
      render json: {
        success: true,
        message: "User created successfully",
        user: user_response(user)
      }, status: :created
    else
      render json: { 
        success: false,
        errors: user.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end
  
  def login
    result = AuthService.authenticate(params[:email], params[:password])
    
    if result[:success]
      render json: {
        success: true,
        message: "Login successful",
        token: result[:token],
        user: user_response(result[:user])
      }, status: :ok
    else
      render json: { 
        success: false,
        error: result[:error] 
      }, status: :unauthorized
    end
  end
  
  def logout
    # Con JWT, el logout se maneja en el frontend eliminando el token
    render json: { message: "Logged out successfully" }, status: :ok
  end
  
  private
  
  def user_params
    params.permit(:name, :email, :password, :role)
  end
  
  def user_response(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    }
  end
end

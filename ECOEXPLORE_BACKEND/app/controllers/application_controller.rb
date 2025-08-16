class ApplicationController < ActionController::API
  before_action :authenticate_request
  
  private
  
  def authenticate_request
    token = request.headers['Authorization']&.split(' ')&.last
    @current_user = AuthService.current_user(token) if token
    
    unless @current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
  
  def current_user
    @current_user
  end
end

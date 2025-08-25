class AuthService
  SECRET_KEY = Rails.application.credentials.secret_key_base || ENV['SECRET_KEY_BASE']
  
  def self.authenticate(email, password)
    Rails.logger.info "AuthService.authenticate - Email: #{email}"
    user = User.find_by(email: email)
    
    if user.nil?
      Rails.logger.error "AuthService.authenticate - User not found for email: #{email}"
      return { success: false, error: "Invalid email or password" }
    end
    
    Rails.logger.info "AuthService.authenticate - User found: #{user.id}"
    Rails.logger.info "AuthService.authenticate - password_digest present: #{user.password_digest.present?}"
    Rails.logger.info "AuthService.authenticate - password_digest length: #{user.password_digest&.length}"
    
    if user.authenticate(password)
      Rails.logger.info "AuthService.authenticate - Password authentication successful"
      token = generate_token(user.id)
      { success: true, token: token, user: user }
    else
      Rails.logger.error "AuthService.authenticate - Password authentication failed"
      { success: false, error: "Invalid email or password" }
    end
  end
  
  def self.generate_token(user_id)
    user = User.find(user_id)
    payload = {
      user_id: user_id,
      role: user.role,
      name: user.name,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end
  
  def self.decode_token(token)
    begin
      decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })
      decoded[0]
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end
  
  def self.current_user(token)
    decoded_payload = decode_token(token)
    User.find(decoded_payload['user_id']) if decoded_payload
  rescue ActiveRecord::RecordNotFound
    nil
  end
end 
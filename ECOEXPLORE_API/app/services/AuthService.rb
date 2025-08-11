class AuthService
  SECRET_KEY = Rails.application.credentials.secret_key_base || ENV['SECRET_KEY_BASE']
  
  def self.authenticate(email, password)
    user = User.find_by(email: email)
    if user&.authenticate(password)
      token = generate_token(user.id)
      { success: true, token: token, user: user }
    else
      { success: false, error: "Invalid email or password" }
    end
  end
  
  def self.generate_token(user_id)
    payload = {
      user_id: user_id,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end
  
  def self.decode_token(token)
    begin
      decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })
      decoded[0]['user_id']
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end
  
  def self.current_user(token)
    user_id = decode_token(token)
    User.find(user_id) if user_id
  rescue ActiveRecord::RecordNotFound
    nil
  end
end 
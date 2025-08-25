class UserService
  Result = Struct.new(:success, :user, :users, :error, keyword_init: true)

  def self.get_all(requesting_user:)
    Rails.logger.info "UserService.get_all by user_id: #{requesting_user.id}"
    
    return Result.new(success: false, error: 'Unauthorized') unless requesting_user&.role == 'admin'
    
    begin
      users = User.all.order(:name)
      Rails.logger.info "Found #{users.count} users"
      Result.new(success: true, users: users)
    rescue StandardError => e
      Rails.logger.error "Error getting all users: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  def self.get_profile(user:)
    Rails.logger.info "UserService.get_profile for user_id: #{user.id}"
    begin
      Result.new(success: true, user: user)
    rescue StandardError => e
      Rails.logger.error "Error getting user profile: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  def self.update_profile(user:, params:)
    Rails.logger.info "UserService.update_profile for user_id: #{user.id}"
    Rails.logger.info "Update params: #{params.inspect}"
    
    begin
      ActiveRecord::Base.transaction do
        if params[:current_password].present? && params[:new_password].present?
          unless user.authenticate(params[:current_password])
            Rails.logger.error " Current password is incorrect"
            return Result.new(success: false, error: "La contraseña actual es incorrecta")
          end
          
          params[:password] = params[:new_password]
          params.delete(:current_password)
          params.delete(:new_password)
        end

        if user.update!(params)
          Rails.logger.info "User profile updated successfully"
          Result.new(success: true, user: user.reload)
        else
          Rails.logger.error "Error updating user profile: #{user.errors.full_messages}"
          Result.new(success: false, error: user.errors.full_messages.join(", "))
        end
      end
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "RecordInvalid: #{e.message}"
      Result.new(success: false, error: e.record.errors.full_messages.join(", "))
    rescue StandardError => e
      Rails.logger.error "StandardError: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  def self.delete_user(requesting_user:, user_id:)
    Rails.logger.info "UserService.delete_user user_id: #{user_id} by: #{requesting_user.id}"
    
    return Result.new(success: false, error: 'Unauthorized') unless requesting_user&.role == 'admin'
    
    begin
      user = User.find(user_id)
      
      if user.id == requesting_user.id
        return Result.new(success: false, error: 'Cannot delete your own account')
      end
      
      user.destroy!
      Rails.logger.info "User deleted successfully"
      Result.new(success: true, user: user)
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "RecordNotFound: #{e.message}"
      Result.new(success: false, error: 'User not found')
    rescue StandardError => e
      Rails.logger.error "StandardError: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end

  def self.update_profile_photo(user:, photo_url:)
    Rails.logger.info "UserService.update_profile_photo for user_id: #{user.id}"
    
    begin
      if user.update!(profile_photo_url: photo_url)
        Rails.logger.info "Profile photo updated successfully"
        Result.new(success: true, user: user.reload)
      else
        Rails.logger.error "Error updating profile photo: #{user.errors.full_messages}"
        Result.new(success: false, error: user.errors.full_messages.join(", "))
      end
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "RecordInvalid: #{e.message}"
      Result.new(success: false, error: e.record.errors.full_messages.join(", "))
    rescue StandardError => e
      Rails.logger.error "StandardError: #{e.message}"
      Result.new(success: false, error: e.message)
    end
  end
end

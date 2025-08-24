class UserController < ApplicationController
  def getUsers
    users = User.all
    render json: users
  end

  def deleteUser
    user = User.find(params[:id])
    user.destroy
    head :no_content
  end
end
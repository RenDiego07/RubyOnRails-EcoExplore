require "test_helper"

class UserControllerTest < ActionDispatch::IntegrationTest
  test "should get getUsers" do
    get user_getUsers_url
    assert_response :success
  end
end

require "test_helper"

class TypeSpecieControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get type_specie_index_url
    assert_response :success
  end
end

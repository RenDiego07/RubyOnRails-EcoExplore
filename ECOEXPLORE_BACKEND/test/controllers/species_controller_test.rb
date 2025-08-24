require "test_helper"

class SpeciesControllerTest < ActionDispatch::IntegrationTest
  test "should get get" do
    get species_get_url
    assert_response :success
  end

  test "should get delete" do
    get species_delete_url
    assert_response :success
  end

  test "should get update" do
    get species_update_url
    assert_response :success
  end
end

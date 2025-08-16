class LowercaseRejectedSightingState < ActiveRecord::Migration[8.0]
  class SightingState < ActiveRecord::Base
    self.table_name = "sighting_states"
  end

  def up
    SightingState.where(code: "REJECTED").update_all(name: "rejected")
  end

  def down
    SightingState.where(code: "REJECTED").update_all(name: "Rejected")
  end
end



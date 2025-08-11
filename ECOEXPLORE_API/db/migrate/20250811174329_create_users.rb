class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :first_name
      t.string :email
      t.string :last_name
      t.string :password

      t.timestamps
    end
  end
end

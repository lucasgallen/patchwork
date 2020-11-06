class AddArchivedToMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :messages, :archived, :boolean, null: false, default: false
  end
end

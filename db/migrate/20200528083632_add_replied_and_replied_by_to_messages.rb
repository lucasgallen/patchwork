class AddRepliedAndRepliedByToMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :messages, :replied,    :boolean, null: false, default: false
    add_column :messages, :replied_by, :string,  null: false, default: ''
  end
end

class ChangeProductAttributes < ActiveRecord::Migration[6.0]
  def change
    remove_column :products, :price, :integer
    remove_column :products, :currency, :string

    add_column :products, :available,  :boolean, default: false
  end
end

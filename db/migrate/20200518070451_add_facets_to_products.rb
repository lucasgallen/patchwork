class AddFacetsToProducts < ActiveRecord::Migration[6.0]
  def change
    add_column :products, :facets, :jsonb, null: false, default: '{}'
  end
end

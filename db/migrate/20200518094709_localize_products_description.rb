class LocalizeProductsDescription < ActiveRecord::Migration[6.0]
  def self.up
    add_column :products, :description_en, :text
    execute "UPDATE products SET description_en = description;"
    rename_column :products, :description, :description_tr
  end

  def self.down
    rename_column :products, :description_tr, :description
    remove_column :products, :description_en
  end
end

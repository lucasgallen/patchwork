class LocalizeCategoriesNameField < ActiveRecord::Migration[6.0]
  def self.up
    add_column :categories, :name_en, :string, unique: true
    execute "UPDATE categories SET name_en = name;"
    change_column :categories, :name_en, :string, null: false, unique: true
    rename_column :categories, :name, :name_tr
  end

  def self.down
    rename_column :categories, :name_tr, :name
    remove_column :categories, :name_en
  end
end

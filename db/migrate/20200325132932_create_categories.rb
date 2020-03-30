class CreateCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :categories do |t|
      t.string :name, null: false, unique: true
      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end

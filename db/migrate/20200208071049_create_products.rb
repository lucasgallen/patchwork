class CreateProducts < ActiveRecord::Migration[6.0]
  def change
    create_table :products do |t|
      t.string  :name,        null: false
      t.text    :description, null: false
      t.integer :price,       null: false, default: 0
      t.string  :currency,    null: false, default: 'try'

      t.timestamps
    end
  end
end

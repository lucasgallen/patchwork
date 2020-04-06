class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.string     :author,  null: false
      t.string     :email, null: false, default: ''
      t.string     :phone, null: false, default: ''
      t.string     :about, null: false
      t.string     :title, null: false
      t.text       :body,  null: false, default: ''
      t.belongs_to :product

      t.timestamps
    end
  end
end

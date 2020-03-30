class Product < ApplicationRecord
  has_one_attached :primary_image
  has_and_belongs_to_many :categories

end

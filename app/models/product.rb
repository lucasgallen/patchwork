class Product < ApplicationRecord
  has_one_attached :gallery_image
  has_many_attached :detail_images

  has_and_belongs_to_many :categories
  has_many :messages

  paginates_per 6

  def height
    self.facets['height']
  end

  def width
    self.facets['width']
  end
end

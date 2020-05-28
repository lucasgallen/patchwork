class Product < ApplicationRecord
  has_one_attached :gallery_image
  has_many_attached :detail_images

  has_and_belongs_to_many :categories
  has_many :messages

  paginates_per 6

  def height
    facets['height']
  end

  def width
    facets['width']
  end

  def description
    self.send("description_#{I18n.locale}")
  end

  def purge_attachments!
    self.gallery_image.purge && self.detail_images.purge
  end

  private

  def self.message_count
    select('products.id, products.name, count(messages.id) as message_count')
      .joins(:messages)
      .group('id')
      .order('message_count desc')
  end
end

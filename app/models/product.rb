class Product < ApplicationRecord
  has_one_attached :gallery_image
  has_many_attached :detail_images

  has_and_belongs_to_many :categories
  has_many :messages

  MAX_PAGINATED_ITEMS = 6

  paginates_per MAX_PAGINATED_ITEMS

  def self.max_paginated_items
    MAX_PAGINATED_ITEMS
  end

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
    (self.gallery_image.purge || !self.gallery_image.attached?) && (self.detail_images.purge || !self.detail_images.attached?)
  end

  private

  def self.message_count
    select('products.id, products.name, count(messages.id) as message_count')
      .joins(:messages)
      .where('messages.archived = false')
      .group('id')
      .order('message_count desc')
  end
end

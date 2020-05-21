class Message < ApplicationRecord
  belongs_to :product, optional: true

  ABOUT_OPTIONS = %w(product misc request).freeze

  paginates_per 5

  def self.about_options
    ABOUT_OPTIONS
  end

  private

  def self.count_by_tag
    select('messages.about, count(messages.id) as tag_count')
      .group('about')
  end

  def self.by_tag(about_option)
    where(about: about_option)
  end

  def self.by_product(id)
    where(product_id: id)
  end

  def self.by_category(slug)
    where('categories.slug = ?', slug)
      .joins({ :product => :categories })
  end
end

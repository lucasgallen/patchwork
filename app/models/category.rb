class Category < ApplicationRecord
  before_validation :generate_slug

  has_and_belongs_to_many :products

  private

  def self.top
    select('categories.id, categories.name, slug, count(products.id) as product_count')
      .joins(:products)
      .group('id')
      .order('product_count desc')
  end

  def generate_slug
    self.slug = self.name.parameterize
  end
end

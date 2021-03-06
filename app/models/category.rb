class Category < ApplicationRecord
  before_validation :generate_slug

  has_and_belongs_to_many :products

  def name
    self.send("name_#{I18n.locale}")
  end

  private

  def self.with_product_count
    select('categories.id, categories.name_tr, categories.name_en, slug, count(products.id) as product_count')
      .joins(:products)
      .group('id')
  end

  def self.with_product_count_ordered
    return Category.none unless Product.any?

    select('categories.id, categories.name_tr, categories.name_en, slug, count(products.id) as product_count')
      .joins(:products)
      .group('id')
      .order('product_count desc')
  end

  def self.message_count
    select('categories.id, categories.name_tr, categories.name_en, slug, count(messages.id) as message_count')
      .joins({ :products => :messages })
      .where('messages.archived = false')
      .group('id')
  end

  def generate_slug
    self.slug = self.name_en.parameterize
  end
end

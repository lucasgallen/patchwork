class Category < ApplicationRecord
  before_validation :generate_slug

  has_and_belongs_to_many :products

  private

  def generate_slug
    self.slug = self.name.parameterize
  end
end

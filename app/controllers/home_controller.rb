class HomeController < ApplicationController
  def show
    @categories = top_five_categories
    @gallery_images = gallery_images
  end

  def not_found
  end

  private

  def gallery_images
    return [] unless Product.any?

    recent_products = Product.last(5)
    images = recent_products.map do |prod|
      next unless prod.gallery_image.attached?
      prod.gallery_image
    end

    images.reject(&:blank?).map{ |i| Decorators::Image.new(i) }
  end

  def top_five_categories
    return Category.none unless Category.any?

    Category.with_product_count_ordered.limit(5)
  end
end

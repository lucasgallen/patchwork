class HomeController < ApplicationController
  def show
    @categories = top_five_categories
    @gallery_images = gallery_images
  end

  private

  def gallery_images
    recent_products = Product.last(5)
    images = recent_products.map do |prod|
      next unless prod.gallery_image.attached?
      prod.gallery_image
    end

    images.reject(&:blank?).map{ |i| Decorators::Image.new(i) }
  end

  def top_five_categories
    Category.top.limit(5)
  end
end

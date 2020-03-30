class HomeController < ApplicationController
  def show
    @categories = Category.all
    @gallery_images = gallery_images
  end

  private

  def gallery_images
    recent_products = Product.last(5)
    images = recent_products.map do |prod|
      next unless prod.gallery_image.attached?
      prod.gallery_image
    end

    images.reject(&:blank?)
  end
end

class Decorators::Product < SimpleDelegator
  def initialize(product)
    @product = product
    super
  end

  def gallery_image
    Decorators::Image.new(@product.gallery_image)
  end

  def detail_images
    Decorators::ImageCollection.new(@product.detail_images)
  end

  def attached?
    false
  end
end

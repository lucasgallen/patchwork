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

  def dimensions?
    @product.width.present? && @product.height.present?
  end

  def dimensions
    "#{width} x #{height}"
  end

  def height
    "#{@product.height}cm"
  end

  def width
    "#{@product.width}cm"
  end
end

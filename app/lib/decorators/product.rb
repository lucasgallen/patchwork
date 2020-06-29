class Decorators::Product < SimpleDelegator
  CAN_SELL_PRODUCT = false

  def initialize(product)
    @product = product
    super
  end

  def can_sell?
    CAN_SELL_PRODUCT
  end

  def gallery_image
    Decorators::Image.new(@product.gallery_image)
  end

  def detail_images
    Decorators::ImageCollection.new(@product.detail_images)
  end

  def has_category?
    @product.categories.present?
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

  def message_cta
    return I18n.t('product.order_now') unless @product.available?

    I18n.t('product.for_sale')
  end

  def message_form_options
    message = Message.new
    { about_select: false, message: message, product: @product }
  end
end

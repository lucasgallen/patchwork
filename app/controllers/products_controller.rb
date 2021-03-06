require 'open-uri'

class ProductsController < ApplicationController
  layout :resolve_layout
  before_action :set_current_view_path

  IMG_HEIGHT = 298
  IMG_WIDTH  = 527

  def index
    authorize! :index, Product
    @order_by = params[:order_by]
    @order = params[:order]
    @products = ordered_products.to_a.map{ |p| Decorators::Product.new(p) }

    render template: template('index')
  end

  def show
    @product ||= product
    @size = { height: IMG_HEIGHT * 2, width: IMG_WIDTH * 2 }
    render template: template('show')
  end

  def new
    @product = new_product
    authorize! :new, Product

    render template: template('new')
  end

  def edit
    authorize! :edit, Product
    @product ||= product
  end

  def create
    authorize! :create, Product
    @product = Product.new(product_params)

    if add_detail_images && @product.save
      redirect_to admin_products_path
    else
      render :new
    end
  end

  def destroy 
    authorize! :delete, Product
    @product ||= product

    if @product.purge_attachments! && @product.destroy
      redirect_to admin_dashboard_path
    else
      render :edit
    end
  end

  def update 
    authorize! :update, Product
    @product ||= product

    if add_detail_images && @product.update(product_params)
      redirect_to admin_products_path
    else
      render :edit, status: 500
    end
  end

  protected

  def product_params
    temp_params = params.require(:product)
                        .permit(:available, :name, :description_tr, :description_en,
                                :gallery_image, facets: {}, category_ids: [])
    temp_params.merge(facets: facet_params)
  end

  def new_detail_images
    @new_detail_images ||= params[:product][:detail_images]
  end

  def facet_params
    params[:product][:facets].permit(:height, :width)
  end

  def add_detail_images
    return false unless @product.present? && product_params.present?
    return true if new_detail_images.nil?

    new_detail_images.each do |image|
      @product.detail_images.attach(image)
    end
  end

  def product
    raw_product = params[:id] ? Product.find(params[:id]) : new_product
    return raw_product if admin_path?

    Decorators::Product.new(raw_product)
  end

  def new_product
    Product.new(name: 'Name', description_tr: I18n.t('product.form.description', locale: :tr),
                description_en: I18n.t('product.form.description', locale: :en))
  end

  def template(action)
    admin_path? ? "admin/products/#{action}" : "products/#{action}"
  end

  def admin_path?
    request.path.match?(/\/admin\//)
  end

  def set_current_view_path
    prepend_view_path 'app/views/admin/' if admin_path?
  end

  def resolve_layout
     admin_path? ? 'admin' : 'application'
  end

  def ordered_products
    order_by = @order_by || :name
    order = @order || :asc

    Product.order(order_by => order).all
  end
end

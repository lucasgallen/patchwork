require 'open-uri'

class ProductsController < ApplicationController
  layout :resolve_layout
  before_action :set_current_view_path

  def index
    @products = Product.all

    render template: template('index')
  end

  def show
    @product ||= product
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

    if @product.save
      redirect_to admin_products_path
    else
      render :new
    end
  end

  def destroy 
    authorize! :delete, Product
    @product ||= product

    if @product.destroy
      redirect_to admin_dashboard_path
    else
      render :edit
    end
  end

  def update 
    authorize! :update, Product
    @product ||= product

    maybe_resize_photos!

    if @product.update(product_params)
      redirect_to admin_products_path
    else
      render :edit
    end
  end

  protected

  def maybe_resize_photos!
    tempfiles = []
    tempfiles.push(product_params[:gallery_image]) if product_params[:gallery_image].present?
    tempfiles += product_params[:detail_images] if product_params[:detail_images].present?
    tempfiles.map!(&:tempfile)

    tempfiles.each do |file|
      resize_photo!(file)
    end
  end

  def product_params
    params.require(:product)
          .permit(:available, :name, :description, :gallery_image,
                  detail_images: [], category_ids: [])
  end

  def product
    params[:id] ? Product.find(params[:id]) : new_product
  end

  def new_product
    Product.new(name: 'Name', description: 'Product description...')
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

  def resize_photo!(tempfile, options={})
    path          = ENV['IMGPROXY_LOCAL_FILESYSTEM_ROOT']
    imgproxy_temp = Tempfile.new('upload', path, encoding: 'ascii-8bit')
    signed_path   = ImgProxy.signed_path(tempfile, imgproxy_temp)
    url           = imgproxy_url(signed_path)

    tempfile.open.truncate(0)
    tempfile.open.write(URI.open(url).read.force_encoding('utf-8'))

    imgproxy_temp.close
    imgproxy_temp.unlink
  end

  def imgproxy_url(signed_path)
    port = ENV['IMGPROXY_PORT']
    return "#{ENV['IMGPROXY_HOST']}:#{ENV['IMGPROXY_PORT']}#{signed_path}" if port.present?
    "#{ENV['IMGPROXY_HOST']}#{signed_path}"
  end
end

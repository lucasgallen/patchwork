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
      redirect_to admin_product_path(@product)
    else
      render :new
    end
  end

  def destroy 
    authorize! :delete, Product
    @product ||= product
  end

  def update 
    authorize! :update, Product
    @product ||= product

    if @product.update(product_params)
      redirect_to admin_product_path(@product)
    else
      render :edit
    end
  end

  protected

  def product_params
    params.require(:product).permit(:name, :description, :price, :currency)
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
end

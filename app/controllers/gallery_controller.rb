class GalleryController < ApplicationController
  def show
    @products = products.order(created_at: :desc).page(0)
  end

  def page
    return if params[:page].blank?

    paginated_items = products.order(created_at: :desc).page(params[:page])
    page_locals = { page_number: params[:page], products: paginated_items }

    render json: {
      html: render_to_string('/gallery/page', locals: page_locals, partial: true),
      last: paginated_items.last_page?
    }
  end

  private

  def products
    return Product.all if params[:filter].blank?

    Product.joins(:categories).where('categories.slug IN (?)', params[:filter].split('_'))
           .distinct
  end
end

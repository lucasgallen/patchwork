class GalleryController < ApplicationController
  def show
    @products = products.page(0)
  end

  def page
    return if params[:page].blank?

    paginated_items = products.page(params[:page])
    page_locals = { page_number: params[:page], products: paginated_items }

    render json: {
      html: render_to_string('/gallery/page', locals: page_locals, partial: true),
      last: paginated_items.last_page?
    }
  end

  private

  def products
    results = filtered_results
      .to_a.map{ |p| Decorators::Product.new(p) }

    Kaminari.paginate_array(results)
  end

  def filtered_results
    return Product.all if params[:filter].blank?

    Product.joins(:categories)
      .where('categories.slug IN (?)', params[:filter].split('_'))
      .distinct.order(created_at: :desc)
  end
end

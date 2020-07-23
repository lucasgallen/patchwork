class GalleryController < ApplicationController
  IMG_HEIGHT = 285
  IMG_WIDTH  = 285

  def show
    @products = products.page(0)
    @img_size = { w: IMG_WIDTH * 2, h: IMG_HEIGHT * 2 }
    @categories = Decorators::Categories.new(Category.with_product_count.all)
    @active_filters = active_filters
  end

  def page
    return if params[:page].blank?

    paginated_items = products.page(params[:page])
    page_locals = { page_number: params[:page], products: paginated_items,
                    img_size: { w: IMG_WIDTH * 2, h: IMG_HEIGHT * 2 } }

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

    Product
      .select('products.*, array_agg(categories.slug)')
      .joins(:categories)
      .group('id')
      .having('array_agg(categories.slug)::text[] @> ARRAY[?]', active_filters)
      .order(created_at: :desc)
  end

  def active_filters
    return [] if params[:filter].blank?
    params[:filter].split('_')
  end
end

class Decorators::Admin::MessagesView
  attr_reader :results_title

  def initialize(options)
    @filter_type = options.fetch(:filter_type, '')
    @keyword = options.fetch(:keyword, '')
  end

  def title_present?
    @filter_type.present? && @keyword.present?
  end

  def results_title
    return '' unless title_present?

    return product_title if filter_is_product?
    return category_title if filter_is_category?

    { label: @filter_type, keyword: @keyword }
  end

  def keyword?(link_keyword)
    @keyword.to_s == link_keyword.to_s
  end

  private

  def filter_is_product?
    @filter_type == 'product'
  end

  def filter_is_category?
    @filter_type == 'category'
  end

  def product_title
    product_name =
      begin
        Product.find(@keyword).name
      rescue ActiveRecord::RecordNotFound
        I18n.t('admin.product_not_found')
      end

    { label: 'product', keyword: product_name }
  end

  def category_title
    category_name =
      begin
        Category.find_by_slug(@keyword).name
      rescue ActiveRecord::RecordNotFound
        I18n.t('admin.category_not_found')
      end

    { label: 'category', keyword: category_name }
  end
end

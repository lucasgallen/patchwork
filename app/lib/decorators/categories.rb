class Decorators::Categories < SimpleDelegator
  def initialize(categories)
    @categories = categories
    super
  end

  def results_for(filter, all_total)
    return no_filter(all_total) unless filter.present?

    category = @categories.find_by(slug: filter)
    key = category.product_count == 1 ? 'result_for' : 'results_for'
    count = category.product_count

    I18n.t("gallery.#{key}", count: count, filter: filter)
  end

  def no_filter(total)
    key = total == 1 ? 'result_for_all' : 'results_for_all'
    I18n.t("gallery.#{key}", count: total)
  end
end

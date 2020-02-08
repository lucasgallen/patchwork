class HomeController < ApplicationController
  def show
    @latest = {
      articles: Article.last(2),
      products: Product.last(2)
    }
  end
end

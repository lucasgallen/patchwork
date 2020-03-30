class Admin::DashboardController < Admin::BaseController
  def show
    authorize! :view, :dashboard

    @products = Product.last(5)
  end
end

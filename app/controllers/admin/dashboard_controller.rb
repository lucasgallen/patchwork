class Admin::DashboardController < Admin::BaseController
  def show
    authorize! :view, :dashboard

    @categories = Category.last(5)
    @products = Product.last(5)
    @messages = Message.last(6)
  end
end

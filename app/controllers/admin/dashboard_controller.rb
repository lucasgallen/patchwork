class Admin::DashboardController < Admin::BaseController
  def show
    authorize! :view, :dashboard

    @categories = Category.order(updated_at: :desc).first(5)
    @products = Product.order(updated_at: :desc).first(5)
    @messages = Message.order(created_at: :desc).first(3)

    @view = Decorators::Admin::MessagesView.new(params)
  end
end

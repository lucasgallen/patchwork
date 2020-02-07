class Admin::DashboardController < Admin::BaseController
  def show
    authorize! :view, :dashboard

    @articles = Article.last(5) || []
  end
end

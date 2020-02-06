class Admin::DashboardController < Admin::BaseController
  def show
    authorize! :view, :dashboard
  end
end

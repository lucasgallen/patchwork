class ApplicationController < ActionController::Base

  protected

  def after_sign_in_path_for(user)
    return admin_dashboard_path if user.role === 'admin'

    stored_location_for(user) || root_path
  end
end

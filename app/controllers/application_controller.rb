class ApplicationController < ActionController::Base

  protected

  def after_sign_in_path_for(user)
    default_path = user.role == 'admin' ? admin_root_path : root_path

    return stored_location_for(user) || default_path
  end
end

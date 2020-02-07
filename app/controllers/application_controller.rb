class ApplicationController < ActionController::Base

  rescue_from CanCan::AccessDenied do |exception|
    if user_signed_in?
      flash[:alert] = exception.message
      redirect_to root_path
    else
      redirect_to user_session_path
    end
  end

  protected

  def after_sign_in_path_for(user)
    default_path = user.role == 'admin' ? admin_root_path : root_path

    return stored_location_for(user) || default_path
  end
end

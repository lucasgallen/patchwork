class Admin::BaseController < ApplicationController
  check_authorization

  layout 'admin'

  rescue_from CanCan::AccessDenied do |exception|
    if user_signed_in?
      flash[:alert] = exception.message
      redirect_to root_path
    else
      redirect_to user_session_path
    end
  end
end

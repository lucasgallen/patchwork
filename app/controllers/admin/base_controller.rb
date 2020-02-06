class Admin::BaseController < ApplicationController
  check_authorization

  layout 'admin'

  rescue_from CanCan::AccessDenied do |exception|
    flash[:alert] = exception.message
    redirect_to root_path
  end
end

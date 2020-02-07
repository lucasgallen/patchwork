class ApplicationController < ActionController::Base
  before_action :set_locale

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

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def default_url_options(options = {})
    if I18n.default_locale != I18n.locale
      {locale: I18n.locale}.merge options
    else
      {locale: nil}.merge options
    end
  end
end

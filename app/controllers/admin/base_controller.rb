class Admin::BaseController < ApplicationController
  check_authorization

  layout 'admin'
end

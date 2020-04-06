class ContactController < ApplicationController
  def show
    @message = Message.new
  end
end

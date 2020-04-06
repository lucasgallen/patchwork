class MessagesController < ApplicationController
  def create
    message = Message.new(message_params)

    if message.save
      render json: { status: 'success' }
    else
      render json: { status: 'fail' }
    end
  end

  private

  def message_params
    params.require(:message).permit(
      :author, :email, :phone, :about, :title,
      :body, :product)
  end
end

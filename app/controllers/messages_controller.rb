class MessagesController < ApplicationController
  layout :resolve_layout
  before_action :set_current_view_path

  def create
    message = Message.new(message_params)
    message.product = Product.find(message_params[:product_id])

    if message.save
      render json: { status: 'success' }
    else
      render json: { status: 'fail' }
    end
  end

  def show
    authorize! :show, Message
    @message ||= message

    render template: template('show')
  end

  def index
    authorize! :index, Message
    @messages = Message.all.order(:created_at).page(params[:page])

    render template: template('index')
  end

  private

  def message_params
    params.require(:message).permit(
      :author, :email, :phone, :about, :title,
      :body, :product_id)
  end

  def message
    Message.find(params[:id])
  end

  def template(action)
    admin_path? ? "admin/messages/#{action}" : "messages/#{action}"
  end

  def admin_path?
    request.path.match?(/\/admin\//)
  end

  def set_current_view_path
    prepend_view_path 'app/views/admin/' if admin_path?
  end

  def resolve_layout
     admin_path? ? 'admin' : 'application'
  end
end

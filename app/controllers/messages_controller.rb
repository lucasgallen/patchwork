class MessagesController < ApplicationController
  layout :resolve_layout
  before_action :set_current_view_path
  before_action :check_for_spam, only: [:create]

  def create
    message = Message.new(message_params)
    save_product!(message, message_params[:product_id])

    if message.save
      render json: { status: 'success' }
    else
      render json: { status: 'fail' }
    end
  end

  def show
    authorize! :show, Message
    @message ||= message
    @view = Decorators::Admin::MessagesView.new(params)

    @count_by_category = messages_category_count
    @count_by_tag = messages_tag_count
    @count_by_product = messages_product_count

    render template: template('show')
  end

  def index
    authorize! :index, Message
    @messages ||= messages.order(created_at: :desc).page(params[:page])
    @view = Decorators::Admin::MessagesView.new(params)

    @count_by_category = messages_category_count
    @count_by_tag = messages_tag_count
    @count_by_product = messages_product_count

    @filter_type = params[:filter_type]
    @keyword = params[:keyword]

    render template: template('index')
  end

  def mark_replied
    @message ||= message
    @message.replied = true
    @message.replied_by = current_user.email
    @message.save!
  end

  def archive
    @message ||= message
    @message.archived = true
    @message.save!
  end

  private

  def save_product!(message, product_id)
    return unless product_id.present?

    message.product = Product.find(message_params[:product_id])
  end

  def messages
    type = params[:filter_type]
    keyword = params[:keyword]
    return Message.not_archived.all unless type.present?

    send("messages_by_#{type}", keyword)
  end

  def messages_by_category(slug)
    Message.not_archived.by_category(slug)
  end

  def messages_by_tag(tag_name)
    Message.not_archived.by_tag(tag_name)
  end

  def messages_by_product(product_id)
    Message.not_archived.by_product(product_id)
  end

  def messages_category_count
    Category.message_count
  end

  def messages_tag_count
    Message.not_archived.count_by_tag
  end

  def messages_product_count
    Product.message_count
  end

  def message_params
    params.require(:message).permit(
      :author, :email, :phone, :about, :title,
      :body, :product_id)
  end

  def message
    Message.find(params[:id])
  end

  def spam?
    params[:message][:special_type].present?
  end

  def check_for_spam
    return unless spam?
    render json: { status: 'success' }
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

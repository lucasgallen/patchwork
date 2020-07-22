class Admin::AttachmentsController < Admin::BaseController
  def destroy
    authorize! :delete, ActiveStorage::Attachment

    if attachment.nil?
      render json: { message: t('admin.attachment.not_found') }, status: 404
    elsif attachment.purge_later
      render json: {}, status: 200
    else
      render json: { message: t('admin.attachment.internal_error') }, status: 500
    end
  end

  protected

  def attachment
    ActiveStorage::Attachment.find_by(id: params[:id])
  end
end

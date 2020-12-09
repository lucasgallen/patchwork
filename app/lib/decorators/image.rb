class Decorators::Image < SimpleDelegator
  def initialize(attachment)
    @attachment = attachment
    super
  end

  def imgproxy_url(options = {})
    return @attachment.imgproxy_url(options) unless Rails.env.development?

    storage_path = Rails.root.join("storage").to_s
    path = ActiveStorage::Blob.service
             .send(:path_for, @attachment.key)
             .gsub(storage_path, '')

    Imgproxy.url_for("local://#{path}", options)
  end
end

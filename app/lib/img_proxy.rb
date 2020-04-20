module ImgProxy
  require "openssl"
  require "base64"

  def self.signed_path(rails_temp_image, temp_image)
    key = [ENV['IMGPROXY_KEY']].pack("H*")
    salt = [ENV['IMGPROXY_SALT']].pack("H*")
    path = ENV['IMGPROXY_LOCAL_FILESYSTEM_ROOT']
    temp_image.write(rails_temp_image.read)

    url = "local://#{temp_image.path.gsub(path, '')}"

    resize = "fill"
    width = 800
    height = 450
    gravity = "ce"
    enlarge = 1
    extension = "jpeg"

    path = "/#{resize}/#{width}/#{height}/#{gravity}/#{enlarge}/plain/#{url}@#{extension}"

    digest = OpenSSL::Digest.new("sha256")
    # You can trim padding spaces to get good-looking url
    hmac = Base64.urlsafe_encode64(OpenSSL::HMAC.digest(digest, key, "#{salt}#{path}")).tr("=", "")

    # signed path
    "/#{hmac}#{path}"
  end
end

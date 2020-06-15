Imgproxy.configure do |config|
  port = ENV['IMGPROXY_PORT'].present? ? ":#{ENV['IMGPROXY_PORT']}" : ""

  # Full URL to where imgproxy lives.
  config.endpoint = "#{ENV['IMGPROXY_HOST']}#{port}"

  # Hex-encoded signature key
  config.hex_key = ENV['IMGPROXY_KEY']
  # Hex-encoded signature salt
  config.hex_salt = ENV['IMGPROXY_SALT']

  # Base64 encode all URLs
  config.base64_encode_urls = Rails.env.production?

  # Serve local files on dev machines
  # config.serve_local_images = Rails.env.development?
end

Imgproxy.extend_active_storage!(use_s3: !Rails.env.development?)

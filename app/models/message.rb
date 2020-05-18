class Message < ApplicationRecord
  belongs_to :product, optional: true

  ABOUT_OPTIONS = %w(product misc request).freeze

  paginates_per 15

  def self.about_options
    ABOUT_OPTIONS
  end
end

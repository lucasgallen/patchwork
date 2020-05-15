class Decorators::ImageCollection < SimpleDelegator
  def initialize(collection)
    @collection = collection
    super
  end

  def to_a 
    @collection.to_a.map{ |p| Decorators::Image.new(p) }
  end
end

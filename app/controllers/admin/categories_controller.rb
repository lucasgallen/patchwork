class Admin::CategoriesController < Admin::BaseController
  def index
    authorize! :view, :category

    @categories = Category.all
  end

  def new
    @category = new_category
    authorize! :new, Category

    render :new
  end

  def edit
    authorize! :edit, Category
    @category ||= category
  end

  def create
    authorize! :create, Category
    @category = Category.new(category_params)

    if @category.save
      redirect_to admin_categories_path
    else
      render :new
    end
  end

  def destroy
    authorize! :delete, Category
    @category ||= category
  end

  def update
    authorize! :update, Category
    @category ||= category

    if @category.update(category_params)
      redirect_to admin_categories_path
    else
      render :edit
    end
  end

  protected

  def category_params
    params.require(:category).permit(:name_en, :name_tr)
  end

  def category
    params[:id] ? Category.find(params[:id]) : new_category
  end

  def new_category
    Category.new
  end
end

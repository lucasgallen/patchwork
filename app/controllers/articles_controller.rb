class ArticlesController < ApplicationController
  layout :resolve_layout
  before_action :set_current_view_path


  def index
    @articles = Article.all

    render template: template('index')
  end

  def show
    @article ||= article
    render template: template('show')
  end

  def new
    @article = new_article
    authorize! :new, Article

    render template: template('new')
  end

  def edit
    authorize! :edit, Article
    @article ||= article
  end

  def create
    authorize! :create, Article
    author = current_user.email
    @article = Article.new(article_params.merge(author: author))

    if @article.save
      redirect_to admin_article_path(@article)
    else
      render :new
    end
  end

  def destroy 
    authorize! :delete, Article
    @article ||= article
  end

  def update 
    authorize! :update, Article
    @article ||= article

    if @article.update(article_params)
      redirect_to admin_article_path(@article)
    else
      render :edit
    end
  end

  protected

  def article_params
    params.require(:article).permit(:title, :content)
  end

  def admin_path?
    request.path.match?(/\/admin\//)
  end

  def article
    params[:id] ? Article.find(params[:id]) : new_article
  end

  def new_article
    Article.new(title: 'Title', content: 'Write here...')
  end

  def template(action)
    admin_path? ? "admin/articles/#{action}" : "articles/#{action}"
  end

  def set_current_view_path
    prepend_view_path 'app/views/admin/' if admin_path?
  end

  def resolve_layout
     admin_path? ? 'admin' : 'application'
  end
end

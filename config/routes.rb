Rails.application.routes.draw do
  scope "(:locale)", locale: /en/ do
    devise_for :users
    devise_scope :user do
      get '/sign_in' => 'devise/session#new'
      get '/sign_out' => 'devise/session#destroy'
    end

    get '/', to: 'home#show'
    get 'about', to: 'about#show'
    get 'contact', to: 'contact#show'

    root 'home#show'

    resources :products, only: [:show, :index]
    scope '/admin' do
      resources :products, as: 'admin_products'
    end

    resources :articles, only: [:show, :index]
    scope '/admin' do
      resources :articles, as: 'admin_articles'
    end

    namespace :admin do
      get 'dashboard', to: 'dashboard#show'

      root 'dashboard#show'
    end
  end
end

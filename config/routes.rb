Rails.application.routes.draw do
  devise_for :users
  devise_scope :user do
    get '/sign_in' => 'devise/session#new'
    get '/sign_out' => 'devise/session#destroy'
  end

  get 'home/show'
  get 'about', to: 'about#show'

  root 'home#show'

  resources :articles, only: [:show, :index]
  scope '/admin' do
    resources :articles, as: 'admin_articles'
  end

  namespace :admin do
    get 'dashboard', to: 'dashboard#show'

    root 'dashboard#show'
  end
end

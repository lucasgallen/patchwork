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

    scope '/gallery', as: 'gallery', constraints: { filter: /[a-z]([a-z]|_|-)*[a-z]+/ } do
      get '(/:filter)', to: 'gallery#show'
      get '(/:filter)/:page', to: 'gallery#page', constraints: { page: /[1-9][0-9]*/ }
    end

    root 'home#show'

    resources :products, only: [:show, :index]
    scope '/admin' do
      resources :products, as: 'admin_products'
    end

    resources :messages, only: [:create]
    scope '/admin' do
      put 'messages/:id/replied', to: 'messages#mark_replied', as: 'admin_message_replied'
      put 'messages/:id/archive', to: 'messages#archive', as: 'admin_message_archive'
      resources :messages, as: 'admin_messages', only: [:index, :show]
    end

   # Disable article pages for now
   # resources :articles, only: [:show, :index]
   # scope '/admin' do
   #   resources :articles, as: 'admin_articles'
   # end

    namespace :admin do
      get 'dashboard', to: 'dashboard#show'

      root 'dashboard#show'

      resources :categories
      resources :attachments, only: [:destroy]
    end

    get '/:anything', to: 'home#not_found'
  end
end

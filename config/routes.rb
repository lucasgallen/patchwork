Rails.application.routes.draw do
  get 'home/show'
  get 'about', to: 'about#show'

  root 'home#show'
end

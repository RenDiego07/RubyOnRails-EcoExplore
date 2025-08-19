Rails.application.routes.draw do
  get "/user/getUsers"
  delete "/user/deleteUser/:id", to: "user#deleteUser"
  # Authentication routes
  post '/auth/register', to: 'auth#register'
  post '/auth/login', to: 'auth#login'
  delete '/auth/logout', to: 'auth#logout'

  # Recursos en raíz
  resources :sightings
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end

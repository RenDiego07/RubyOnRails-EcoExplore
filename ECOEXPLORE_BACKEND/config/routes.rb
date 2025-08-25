Rails.application.routes.draw do
  get "type_specie/index"
  get "/species/getSpecies"
  post "/species/create", to: "species#create"
  post "/species", to: "species#create"
  delete "/species/deleteSpecies/:id", to: "species#deleteSpecies"
  post "/species/updateSpecies", to: "species#updateSpecies"
  get "/user/getUsers"
  delete "/user/deleteUser/:id", to: "user#deleteUser"

  post "/sightings/updateState"

  
  # User profile routes (nuevas)
  get '/user/profile', to: 'user#profile'
  patch '/user/profile', to: 'user#update_profile'
  patch '/user/profile_photo', to: 'user#update_profile_photo'
  
  # Authentication routes
  post '/auth/register', to: 'auth#register'
  post '/auth/login', to: 'auth#login'
  delete '/auth/logout', to: 'auth#logout'

  # Recursos en raíz
  resources :sightings do
    collection do
      get :my_sightings
    end
  end
  resources :ecosystems
  
  # User contributed species routes
  resources :user_species, only: [] do
    collection do
      get :my_contributed_species
      get :all_contributed_species
      get :explore_species
    end
  end
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end

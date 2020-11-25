Rails.application.routes.draw do

  resources :members
  get 'home/index'
  root :to => "home#index"
    
  # *MUST* come *BEFORE* devise's definitions (below)
  # updated match path to match with out confirmations path instead of milia's
  as :user do   
    match '/user/confirmation' => 'confirmations#update', :via => :put, :as => :update_user_confirmation
  end

  devise_for :users, :controllers => { 
    :registrations => "milia/registrations",
    # did the same here, took out milias path in confirmations
    :confirmations => "confirmations",
    :sessions => "milia/sessions", 
    :passwords => "milia/passwords", 
  }


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

Rails.configuration.stripe = {
    :publishable_key => ENV['STRIPE_TEST_PUBLISHABLE_KEY'],
    :secret_key => ENV['STRIPE_TEST_SECRET_KEY'],
    :test => ENV['TEST']
}

Stripe.api_key = ENV['STRIPE_TEST_SECRET_KEY']
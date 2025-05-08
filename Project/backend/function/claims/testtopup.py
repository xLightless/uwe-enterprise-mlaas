import stripe

stripe.api_key = 'sk_test_51RLjwsQWp6sm6nVBVkxojARY1qOfMp6Sgmt8PYJ0XZUIq9lpGJ8wJqVnpyUvuXXCW11xOFuYSUc2fa9RuVUYaO7u00N9TPynYh'  # Your platform's secret key

stripe.Charge.create(
  amount=10000000,  # $100
  currency='gdp',
  source={
    'object': 'card',
    'number': '4000000000000077',  # Special test card to top up balance
    'exp_month': 12,
    'exp_year': 2034,
    'cvc': '123',
  },
  description='Top up connected account balance',
  # 👇 Specify the connected account's ID
  stripe_account='acct_XXXXXXXXXXXX',
)

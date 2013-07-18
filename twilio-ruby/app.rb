require 'rubygems'
require 'sinatra'
require 'sinatra/config_file'
require 'sinatra/json'
require 'twilio-ruby'

# Load a YAML configuration file with out account info and other data
config_file './config.yml'

# create a client for the REST API
client = Twilio::REST::Client.new settings.accountSid, settings.authToken

# Serve the home page for the empty route
get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

# Handle an ajax POST to send an SMS
post '/sms' do
	# Use the REST API client to send a text message
  client.account.sms.messages.create(
	  :from => settings.twilioNumber,
	  :to => params[:to],
	  :body => 'Hello there! Your Twilio environment has been configured.'
	)

  # Render JSON in response to the request
	json :error => false
end

# handle an ajax POST to make a call
post '/call' do
	# Use the REST API client to make an outbound call
  client.account.calls.create(
	  :from => settings.twilioNumber,
	  :to => params[:to],
	  :url => "#{settings.baseUrl}/hello",
	  :method => 'GET'
	)

	# Render JSON in response to the request
	json :error => false
end

# handle an ajax POST and generate a capability token for Twilio Client
# This token enables outbound VoIP calling from the browser
post '/capability' do
	# Create a capability token generator capable of creating a token for outbound calls
	capability = Twilio::Util::Capability.new settings.accountSid, settings.authToken
	capability.allow_client_outgoing 'AP784bd34e34fab9759b8e91d3ef3680b9'

	# Render JSON with the capability token back to the client
	json :token => capability.generate
end

# Render a TwiML document that will say a message back to the user
get '/hello' do
	# Build a TwiML response
	response = Twilio::TwiML::Response.new do |r|
	  r.Say 'Hello there! Your Twilio environment has been configured.'
	  r.Say 'Good luck during the workshop!', :voice => 'woman'
	end

	# Render an XML (TwiML) document
	content_type 'text/xml'
	response.text
end
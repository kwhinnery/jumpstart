// Module dependencies
var express = require('express'), 
    http = require('http'), 
    path = require('path'),
    twilio = require('twilio'),
    config = require('./config'); // JSON configuration with your Twilio info

// create a Twilio REST API client that can make authenticated calls against
// the Twilio back end:
var twilioApi = new twilio.RestClient(config.accountSid, config.authToken);

// Create an Express web application
var app = express();

// Configure it with some standard options...
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function() {
    app.use(express.errorHandler());
});

// Handle Ajax POST request to send an SMS
app.post('/sms', function(request, response) {
    // Use the REST client to send an SMS text message
    twilioApi.sendSms({
        // This is the number input by the user on the web page
        to:request.body.number,

        // Send message from your Twilio number
        from:config.twilioNumber,

        // Body of the message
        body:'Hello there! Your Twilio environment has been configured.'
        
    }, function(error, data) {
        // Create a simple JSON response, just true or false
        response.send({
            error: (error) ? true : false
        });
    });
});

// Handle Ajax POST request to make a phone call
app.post('/call', function(request, response) {
    // Use the REST client to connect an outbound call
    twilioApi.makeCall({
        // This is the number input by the user on the web page
        to:request.body.number,

        // Make an outbound call from your Twilio number
        from:config.twilioNumber,

        // Construct a URL for TwiML instructions for this call
        // Assumes you're using a Forward endpoint, started with a command like
        // "forward 3000 ktw"
        url:'https://' + config.myInitials
            + '-1337.fwd.wf/hello',

        // Tell Twilio to fetch the above TwiML with a GET request
        method:'GET'
    }, function(error, data) {
        // Create a simple JSON response, just true or false
        response.send({
            error: (error) ? true : false
        });
    });
});

// Handle Ajax POST request to generate a Twilio capability token
app.post('/capability', function(request, response) {
    // Create an object that will generate a "capability token"
    // http://www.twilio.com/docs/client/capability-tokens
    var capability = new twilio.Capability(config.accountSid, config.authToken);

    // Allow outbound calling using the TwiML instructions configured in this
    // TwiML app
    capability.allowClientOutgoing(config.twimlAppSid);

    // Allow inbound calls to your browser client, identified by your initials
    capability.allowClientIncoming(config.myInitials);

    // Send a JSON response with the capability token
    response.send({
        token:capability.generate()
    });
});

// A TwiML document that will connect an outbound call to the requested number
app.get('/dial', function(request, response) {
    // Construct TwiML response, which will <Dial> the number 
    var twiml = new twilio.TwimlResponse();
    twiml.dial(request.params.number, {
        callerId:config.twilioNumber
    });

    // Render the XML in response to this request
    response.set('Content-Type', 'text/xml');
    response.send(twiml.toString());
});

// A TwiML document that will say back a message to the called person
app.get('/hello', function(request, response) {
    // Construct TwiML response, which will <Say> two messages
    var twiml = new twilio.TwimlResponse();
    twiml.say('Hello there! Your Twilio environment has been configured.')
        .say('Good luck during the workshop!', {
            voice:'woman'
        });

    // Render the XML in response to this request
    response.set('Content-Type', 'text/xml');
    response.send(twiml.toString());
});

// Start an HTTP server - on your local machine, this app will be available at
// http://localhost:3000/
http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

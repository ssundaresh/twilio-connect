// Load app dependencies
var http = require('http'),
    path = require('path'),
    express = require('express'),
    twilio = require('twilio');

// Load configuration information from system environment variables.
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    
// Create an authenticated client to access the Twilio REST API
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

var token = "";
// Create an Express web application with some basic configuration
var conference = express();

conference.configure(function(){
    conference.set('port', '8082');
    conference.set('views', __dirname + '/views');
    conference.set('view engine', 'ejs');
    conference.use(express.favicon());
    conference.use(express.logger('dev'));
    conference.use(express.bodyParser());
    conference.use(express.methodOverride());
    conference.use(conference.router);
    conference.use(express.static(path.join(__dirname, 'public')));
});
var conferenceToken = new twilio.conference(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

conference.get('/', function(request, response) {
    
    conferenceToken.allowClientIncoming('tommy');
    conferenceToken.allowClientOutgoing('AP0834bc072a83d0cf44c3310a12301f18');
    response.render('conference.ejs', {
        token:conferenceToken.generate()
    });
});

conference.post('/', function(request, response) {
    conferenceToken.allowClientIncoming('tommy');
});

conference.get('/form', function(request, response) {
  response.render('conference.ejs', {
      token:token
  });  
});
conference.get('/call', function(request, response) {
    var twiml = new twilio.TwimlResponse();
    twiml.dial({
        callerId: '+17135974166'
   }, function(){
     this.number(request.query.tocall);
   });
     response.set('Content-Type', 'text/xml');
    response.send(twiml.toString());
});
// Start our express ivr, by default on port 3000
http.createServer(conference).listen(conference.get('port'), function(){
    console.log("Express server listening on port " + conference.get('port'));
});
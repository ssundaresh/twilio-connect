// Load app dependencies
var http = require('http'),
    path = require('path'),
    express = require('express');


// Create an Express web application with some basic configuration
var capability = express();

capability.configure(function(){
    capability.set('port', '8082');
    capability.set('views', __dirname + '/views');
    capability.set('view engine', 'ejs');
    capability.use(express.favicon());
    capability.use(express.logger('dev'));
    capability.use(express.bodyParser());
    capability.use(express.methodOverride());
    capability.use(capability.router);
    capability.use(express.static(path.join(__dirname, 'public')));
});
capability.get('/workday', function(request, response) {
    var requestBody = request.body;
    console.log(requestBody);

response.send("ack");
});

capability.get('/consumer', function(request, response) {
    var requestBody = request.body;
    console.log(requestBody);

response.send("Success!!");
});

capability.get('/home', function(request, response) {
    response.render('connect.ejs');
});

// Create http server and run it
var server = http.createServer(capability);
var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Express server running on *:' + port);
});
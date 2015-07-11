var config = require('./config.js');

var port = process.env.PORT || 8080;

var express = require('express');
var app = express();


var bodyParser = require('body-parser');
app.use(bodyParser());

var cookieParser = require('cookie-parser');
app.use(cookieParser());

//var path = require('path');

app.use(express.static(config.static_path));


var router = require('./routes.js');
app.use('/',router);


app.listen(port,function(){
	console.log("App is listening");
})


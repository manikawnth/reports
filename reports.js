var config = require('./config.js');

exports.home = function(req,res){
	res.sendFile('index.html',{root:config.static_path});
}

exports.postRntlog = function(req,res){
	res.sendFile('json/rntlog.json',{root:config.static_path});
}
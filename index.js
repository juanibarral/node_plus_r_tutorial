/**
 * index.js
 * Main file for Application
 * @author: Juan Camilo Ibarra
 * @Creation_Date: November 2016
 * @version: 1.0.0
 * @Update_Author : Juan Camilo Ibarra
 * @Date: November 2016
 */

// Create express application
var config = {
	port : 4000
}
var express = require('express');
var app = express();
var path = require("path");
var my_module = require('./my_modules/r_connector.js')


// Serving static files (http://expressjs.com/starter/static-files.html)
app.use(express.static(__dirname + '/public'));

// Routing for express (http://expressjs.com/guide/routing.html)
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/main.html');
});

app.get('/get_data', function(req, res){
	var data = [];
	for(var i = 0; i < 100; i++)
	{
		data.push(Math.random());
	}

	my_module.run_r({
		filename : path.join(__dirname, "data/r_script.R"),
		entrypoint : "getHistogram",
		data : data,
		callback : function(err, result)
		{
			if(!err)
			{
				console.log(result);
				res.json(result);
			}
			else
			{
				console.log("error: " + err);
			}
		}
	})


});
//*******************************************
// CUSTOM MODULES
//*******************************************

// Start app and listen on port for connections
var server = app.listen(config.port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Application listening at http://%s:%s', host, port);
}); 

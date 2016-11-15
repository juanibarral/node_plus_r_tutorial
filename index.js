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
var r_connector = require('./my_modules/r_connector.js')
var fs = require('fs');


// Serving static files (http://expressjs.com/starter/static-files.html)
app.use(express.static(__dirname + '/public'));

// Routing for express (http://expressjs.com/guide/routing.html)
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/main.html');
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

var io_lib = require('socket.io');
var io = io_lib(server);
io.on('connection', function(socket){
	socket.on('get_raw_data', function(raw){
		fs.readFile('data/plane_crashes.js', 'utf8', function (err, data) {
			if (err) 
				throw err;
			obj = JSON.parse(data);

			var dateMap = {
				days : [],
				hours : [],
				fatalities : []
			}
			for(i in obj.data)
			{
				var o = obj.data[i];
				var obj_col = o[8];
				var obj_date = new Date(obj_col);
				var obj_hour = o[9] ? o[9].split(':')[0] : "00";
				var obj_fatal = o[18];
				var day = ("0" + obj_date.getDate()).slice(-2);
				var year = obj_date.getFullYear();
				var month = ("0" + (obj_date.getMonth() + 1)).slice(-2);

				var date = year + "-" + month + "-" + day;
				var hour = parseInt(obj_hour);

				dateMap.days.push(date);
				dateMap.hours.push(hour > 23 ? 0 : hour);
				dateMap.fatalities.push(parseInt(obj_fatal == null ? 0 : obj_fatal));
			}
			socket.emit("raw_data", dateMap);
			
		});
	})

	socket.on('cluster_data', function(raw_data){
		r_connector.run_r({
				filename : path.join(__dirname, "data/r_script.R"),
				entrypoint : "clusterData",
				data : raw_data,
				callback : function(err, result)
				{
					if(!err)
					{
						socket.emit("clustering_result", JSON.parse(result));
					}
					else
					{
						console.log("error: " + err);
					}
				}
			})
	})
});


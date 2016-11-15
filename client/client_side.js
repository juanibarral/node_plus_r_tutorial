var io = require('socket.io-client');
var r_connector = require('../my_modules/r_connector.js');
var path = require("path");

var socket = io.connect();

var c3 = require("c3");

socket.on("raw", function(raw){
	console.log(raw);

	
})

socket.on("clustering_result", function(raw){
	var clustered_data = raw.clustered_data["fit.cluster"];

	var cluster_1_x = ["cluster_1"]
	var cluster_1_y = ["cluster_1_y"]

	var cluster_2_x = ["cluster_2"]
	var cluster_2_y = ["cluster_2_y"]

	var cluster_3_x = ["cluster_3"]
	var cluster_3_y = ["cluster_3_y"]

	var cluster_4_x = ["cluster_4"]
	var cluster_4_y = ["cluster_4_y"]

	var days = rawDataFromServer.days;
	var hours = rawDataFromServer.hours;

	for(i in days)
	{
		var cluster_number = clustered_data[i];
		switch(cluster_number)
		{
			case 1:
				cluster_1_x.push(days[i]);
				cluster_1_y.push(hours[i]);
			break;
			case 2:
				cluster_2_x.push(days[i]);
				cluster_2_y.push(hours[i]);
			break;
			case 3:
				cluster_3_x.push(days[i]);
				cluster_3_y.push(hours[i]);
			break;
			case 4:
				cluster_4_x.push(days[i]);
				cluster_4_y.push(hours[i]);
			break;
		}
	}
	


	var columns = [ 
		cluster_1_x, 
		cluster_1_y,
		cluster_2_x, 
		cluster_2_y,
		cluster_3_x, 
		cluster_3_y,
		cluster_4_x, 
		cluster_4_y,
	];

	chart = c3.generate({
		bindto : "#my_chart",
	    data: {
	        xs: {
	            cluster_1_y: 'cluster_1',
	            cluster_2_y: 'cluster_2',
	            cluster_3_y: 'cluster_3',
	            cluster_4_y: 'cluster_4',
	        },
	        columns: columns,
	        type: 'scatter'
	    },
	    axis: {
	        x: {
	        	type : "timeseries",
	            label: 'date',
	            tick: {
	                format : '%Y-%m-%d'
	            }
	        },
	        y: {
	            label: 'Hour of day'
	        }
	    }
	});
	
})

var rawDataFromServer = [];
var chart = null;

socket.on("raw_data", function(raw){
	rawDataFromServer = raw;

	var days = ['days_x'].concat(raw.days);
	var hours = ['hours_y'].concat(raw.hours);
	var columns = [ days, hours];

	chart = c3.generate({
		bindto : "#my_chart",
	    data: {
	        xs: {
	            hours_y: 'days_x'
	        },
	        columns: columns,
	        type: 'scatter'
	    },
	    axis: {
	        x: {
	        	type : "timeseries",
	            label: 'date',
	            tick: {
	                format : '%Y-%m-%d'
	            }
	        },
	        y: {
	            label: 'Hour of day'
	        }
	    }
	});
})

var getData = function()
{
	socket.emit('get_raw_data');
}

var clusterData = function()
{
	socket.emit('cluster_data', rawDataFromServer.fatalities);
}

module.exports = {
	getData : getData,
	clusterData : clusterData
}


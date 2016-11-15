
var rio = require("rio")


var settings = {
	host : "127.0.0.1",
	port : "6311",
}


var run_r = function(params)
{
	for(each in params)
	{
		settings[each] = params[each];
	}
	rio.e(settings);
}

module.exports = {
	run_r : run_r
}
var fs = require('fs-extra');
var promise = require('promise');
var readFile = promise.denodeify(require('fs').readFile);
var replaceall = require("replaceall");

exports.generate = function(filenames) {
    var handler_file = readFile('handler.js', 'utf-8');

    for (var filename in filenames) {
	var config_file = readFile(filenames[filename], 'utf-8').then(JSON.parse);

	promise.all([handler_file, config_file]).nodeify(function(err, obj) {
		var handler_file = obj[0];
		var config_file = obj[1];

		var handler_js = replaceall('{{name}}', config_file['description'], handler_file);

		fs.writeFile("generated/" + config_file['description'] + ".js", handler_js, function(err) {
			if(err) {
			    return console.log(err);
			}

			console.log("The file was saved!");
		    }); 
	    });
    }
}
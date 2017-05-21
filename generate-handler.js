var fs = require('fs-extra');
var promise = require('promise');
var readFile = promise.denodeify(fs.readFile);
var writeFile = promise.denodeify(fs.writeFile);
var replaceall = require("replaceall");
const gfm = require('get-module-file');

exports.generate = function(filenames) {

    var handler_path = gfm.sync(__dirname, 'rest-serverless-generator', 'templates/handler.js');
    var handler_file = readFile(handler_path, 'utf-8');

    for (var filename in filenames) {
	var config_file = readFile(filenames[filename], 'utf-8').catch(console.err).then(JSON.parse);

	promise.all([handler_file, config_file]).nodeify(function(err, obj) {
		if (err) {
		    console.log(err);
		}
		
		var handler_file = obj[0];
		var config_file = obj[1];

		var handler_js = replaceall('{{name}}', config_file['description'], handler_file);

		writeFile("generated/" + config_file['description'] + ".js", handler_js).catch(console.err).then(function() { console.log("successfully wrote handler for " + config_file['description'])});
	    });
    }
}
var fs = require('fs-extra');
var promise = require('promise');
var readFile = promise.denodeify(fs.readFile);
var writeFile = promise.denodeify(fs.writeFile);
var replaceall = require("replaceall");

var generateFragments = function*(filenames) {

    var functions_file = readFile('templates/functions.yml', 'utf-8').catch(console.err);

    for (var filename in filenames) {
	var config_file = readFile(filenames[filename], 'utf-8').catch(console.err).then(JSON.parse);

	yield promise.all([functions_file, config_file]).then(function(obj) {
		var function_file = obj[0];
		var config_file = obj[1];
		
		var serverless_yml = replaceall('{{name}}', config_file['description'], function_file);
		return serverless_yml;
	    });
    }
};

exports.generate = function(filenames, name) {

    var serverless_yml = readFile('templates/serverless.yml','utf-8').catch(console.err);

    var serverless_config_fragments = [serverless_yml];

    for (var fragment of generateFragments(filenames)) {
	serverless_config_fragments.push(fragment);
    }

    promise.all(serverless_config_fragments).then(function(obj) {
	    var base_yml = obj[0];
	    var functions = obj.slice(1).join('\n');
	    var serverless_yml = replaceall('{{function-list}}', functions, replaceall('{{name}}', name, base_yml));

	    writeFile("generated/serverless.yml", serverless_yml).catch(console.err).then(function () {console.log("sucessfully wrote serverless file")});
	}).catch(console.err);
}
var fs = require('fs-extra');
var beautify = require('js-beautify');
var argv = require('minimist');
var promise = require('promise');
var readFile = promise.denodeify(fs.readFile);
var replaceall = require("replaceall");
var exec = require('child_process').exec;


var tableGenerator = require("./generate-table");
var handlerGenerator = require("./generate-handler");
var serverlessGenerator = require("./generate-serverless");

exports.generateConfig = function(filenames, name) {
    var filename_split = filenames.split(',');

    promise.denodeify(fs.ensureDirSync)('generated').catch(console.err).then(function() {console.log("successfully created generated directory")});
    promise.denodeify(fs.emptyDirSync)('generated').catch(console.err).then(function() {console.log("ensured generated directory is empty")});

    tableGenerator.generate(filename_split);
    handlerGenerator.generate(filename_split);
    serverlessGenerator.generate(filename_split, name);

    promise.denodeify(fs.copy)('templates/generic_service.js','generated/generic_service.js').catch(console.err).then(function() {console.log("successfully copied generic service file")});
    promise.denodeify(fs.copy)('templates/package.json','generated/package.json').catch(console.err).then(function() {console.log("successfully copied package.json file")});

    var child = exec('cd generated; npm install',
		 function (error, stdout, stderr) {
		     console.log('stdout: ' + stdout);
		     console.log('stderr: ' + stderr);
		     if (error !== null) {
			 console.log('exec error: ' + error);
		     }
		 });
}

var function_map = argv(process.argv.slice(2));
var filename = function_map['f'];
var name = function_map['n'];
exports.generateConfig(filename, name);
var fs = require('fs-extra');
var beautify = require('js-beautify');
var argv = require('minimist');
var promise = require('promise');
var readFile = promise.denodeify(require('fs').readFile);
var replaceall = require("replaceall");

var tableGenerator = require("./generate-table");
var handlerGenerator = require("./generate-handler");
var serverlessGenerator = require("./generate-serverless");

exports.generateConfig = function(filenames, name) {
    var filename_split = filenames.split(',');

    fs.ensureDirSync('generated');
    fs.emptyDirSync('generated');

    tableGenerator.generate(filename_split);
    handlerGenerator.generate(filename_split);
    serverlessGenerator.generate(filename_split, name);
}

var function_map = argv(process.argv.slice(2));
var filename = function_map['f'];
var name = function_map['n'];
exports.generateConfig(filename, name);
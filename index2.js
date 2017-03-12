var fs = require('fs');
var beautify = require('js-beautify');
var argv = require('minimist');
var promise = require('promise');
var readFile = promise.denodeify(require('fs').readFile);
var replaceall = require("replaceall");

var generateDynamoProperty = function(property_object) {
    switch (property_object["type"]) {
    case "string":
	return "Joi.string()";
	break;
    case "integer":
	return "Joi.integer()";
	break;
    case "array":
	var object_info = generateDynamoProperty(property_object["items"]);
	return "Joi.array().items(" + object_info + ")";
	break;
    case "object":
	var object_info = "Joi.object().keys(" + generateDynamoSchema(property_object) + ")";
	return object_info;
	break;
    default:
	throw "Unrecognized property type " + property_object["type"];
    }
};

var generateDynamoSchema = function(obj) {
    if (obj && obj.hasOwnProperty('properties')) {
	var properties = obj["properties"];
	var field_list = [];

	field_list.push('id: dynogels.types.uuid()');
        field_list.push('date_created: Joi.date()');
	field_list.push('date_updated: Joi.date()');

	for (var property in properties) {
	    var property_object = properties[property];
	    field_list.push(property + ': ' + generateDynamoProperty(property_object));
	}
	
	return '{' + field_list.join(',') + '}';
    } else {
	return '';
    }
};

exports.generateConfig = function(filenames) {
    var filename_split = filenames.split(',');
    var functions_file = readFile('functions.yml', 'utf-8');
    var handler_file = readFile('handler.js', 'utf-8');
    
    for (var filename in filename_split) {
	var config_file = readFile(filename_split[filename], 'utf-8').then(JSON.parse);

	// generate dynamo table schema
	config_file.nodeify(function(err, obj) {
		var dynamo_schema = generateDynamoSchema(obj);
		var const_def = 'const ' + obj['description'] + ' = ' + dynamo_schema;
		console.log(beautify.js_beautify(const_def));
	    });

	
	// generate section of serverless config file
	promise.all([functions_file, config_file]).nodeify(function(err, obj) {
		var function_file = obj[0];
		var config_file = obj[1];

		var serverless_yml = replaceall('{{name}}', config_file['description'], function_file);
		console.log(serverless_yml);
	    });
	
	
	// generate handler files
	promise.all([handler_file, config_file]).nodeify(function(err, obj) {
		var handler_file = obj[0];
		var config_file = obj[1];

		var handler_js = replaceall('{{name}}', config_file['description'], handler_file);
		console.log(handler_js);
	    });
	
    }
}

var function_map = argv(process.argv.slice(2));
var filename = function_map['f'];
exports.generateConfig(filename);
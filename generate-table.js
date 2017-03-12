var fs = require('fs-extra');
var beautify = require('js-beautify');
var promise = require('promise');
var readFile = promise.denodeify(fs.readFile);
var writeFile = promise.denodeify(fs.writeFile);
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

var generateFragments = function*(filenames) {
    for (var filename in filenames) {
        yield readFile(filenames[filename], 'utf-8').then(JSON.parse).then(function(obj) {
		var dynamo_schema = generateDynamoSchema(obj);
		var const_def = 'module.exports.' + obj['description'] + ' = ' + dynamo_schema;
		return beautify.js_beautify(const_def);
	    }).catch(console.err);
    }
}

exports.generate = function(filenames) {
    
    var fragments = [];
    for (var fragment of generateFragments(filenames)) {
	fragments.push(fragment);
    }

    promise.all(fragments).then(function(obj){
	    writeFile("generated/tables.js", obj.join('\n')).catch(console.err).then(function() { console.log("tables written"); });
	});
}
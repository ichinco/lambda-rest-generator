var fs = require('fs-extra');
var beautify = require('js-beautify');
var promise = require('promise');
var readFile = promise.denodeify(fs.readFile);
var writeFile = promise.denodeify(fs.writeFile);
var replaceall = require("replaceall");
var util = require("util");
const gfm = require('get-module-file');

var generateDynamoProperty = function(property_object) {
    switch (property_object["type"]) {
    case "string":
	return "Joi.string()";
	break;
    case "integer":
    return "Joi.number().integer()";
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

var generateDynogel = function(name,schema) {
    return util.format("dynogels.define('%s', {hashKey: 'id', timestamps: true, tableName: '%s-dev', schema:%s});", name, name, schema);

}

var generateFragments = function*(filenames) {
    for (var filename in filenames) {
        yield readFile(filenames[filename], 'utf-8').then(JSON.parse).then(function(obj) {
		var dynamo_schema = generateDynamoSchema(obj);
		var const_def = 'module.exports.' + obj['description'] + ' = ' + generateDynogel(obj['description'],dynamo_schema);
		return beautify.js_beautify(const_def);
	    }).catch(console.err);
    }
}

exports.generate = function(filenames) {

    var tables_path = gfm.sync(__dirname, 'rest-serverless-generator', 'templates/tables.js');
    var tables_template = readFile(tables_path,'utf-8').catch(console.err);
    
    var fragments = [tables_template];
    for (var fragment of generateFragments(filenames)) {
	fragments.push(fragment);
    }

     promise.all(fragments).then(function(obj){
	    var base_file = obj[0];
	    var tables = obj.slice(1).join('\n\n');
	    var output_file = replaceall('{{table_list}}', tables, base_file);

	    writeFile("generated/tables.js", output_file).catch(console.err).then(function() { console.log("tables written"); });
	}).catch(console.err);
}
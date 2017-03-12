var fs = require('fs');
var beautify = require('js-beautify');
var argv = require('minimist')

var generateDynamoProperty = function(property_object) {
    console.log(property_object);
    switch (property_object["type"]) {
    case "string":
	return "{type: graphql.GraphQLString}";
	break;
    case "integer":
	return "{type: graphql.GraphQLInt}";
	break;
    case "array":
	var object_info = generateDynamoProperty(property_object["items"]);
	return "{type: graphql.GraphQLList(" + object_info + ")}";
	break;
    case "object":
	var object_info = generateDynamoSchema(property_object);
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
	for (var property in properties) {
	    var property_object = properties[property];
	    field_list.push(property + ': ' + generateDynamoProperty(property_object));
	}
	
	return 'new graphql.GraphQLObjectType({name: "' + obj['description'] + '", fields: {' + field_list.join(',') + '}})';
    } else {
	return '';
    }
};

exports.generateConfig = function(filename) {

    fs.readFile(filename, 'utf8', function (err, data) {
	    if (err) throw err;
	    var config_file = JSON.parse(data);

	    var dynamo_schema = generateDynamoSchema(config_file);
	    var const_def = 'const ' + config_file['description'] + ' = ' + dynamo_schema;
	    console.log(beautify.js_beautify(const_def));
	});
}

var function_map = argv(process.argv.slice(2));
var filename = function_map['f'];
var service_name = function_map['n'];
exports.generateConfig(filename, name);
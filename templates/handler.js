const tables = require('tables.js');
const genericService = require('generic_service.js');
const stampit = require('stampit');

const table_name = '{{name}}';
const table = tables.{{name}};
const service = genericService({"table": table});

module.exports.create = function(event, context, cb) {
    console.log('got create ' + table_name);
    console.log(event.body);
    service.createNew(event.body)
    .then(function (resp) {
	    const response = {
		statusCode: 201,
		headers: {
		},
		body: JSON.stringify(resp)
	    };
	    
	    cb(null, response);
	})
    .catch(function (err){
	    cb(new Error(err));
	});
};

module.exports.list = function(event, context, cb) {
    console.log('got list ' + table_name);
    service.getByIds(event.body.ids)
    .then(function (resp) {
	    const response = {
		statusCode: 200,
		headers: {
		},
		body: JSON.stringify(resp)
	    };

	    cb(null, response);
	})
    .catch(function (err){
	    cb(new Error(err));
	});
};

module.exports.get = function(event, context, cb) {
    console.log('got get' + table_name);
    service.getById(event.pathParameters.id).then(function(resp) {
	    const response = {
		statusCode: 200,
		headers: {
		},
		body: JSON.stringify(resp)
	    };

	    cb(null, response);
	});
};

module.exports.update = function(event, context, cb) {
    console.log('got update ' + table_name);
    service.update(event.body)
    .then(function (resp) {
	    const response = {
		statusCode: 200,
		headers: {
		},
		body: JSON.stringify(resp)
	    };

	    cb(null, response);
	})
    .catch(function (err){
	    cb(new Error(err));
	});
};

module.exports.delete = function(event, context, cb) {
    console.og('got delete ' + table_name);
    service.delete(event.pathParameters.id)
    .then(function (resp) {
	    const response = {
		statusCode: 200,
		headers: {
		},
		body: JSON.stringify(resp)
	    };

	    cb(null, response);
	})
    .catch(function (err){
	    cb(new Error(err));
	});
};

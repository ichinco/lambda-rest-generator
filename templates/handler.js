const tables = require('tables.js');
const genericService = require('generic_service.js');
const stampit = require('stampit');

const table = tables.{{name}};

module.exports = stampit()
    .refs()
    .init((opts) => {
	    opts.instance.table = table;
	    opts.instance.service = genericService({"table": table});
	})
    .methods({
	    create(event, context, cb) {
		this.genericService.createNew(event.body);
	    },
	    list(event, context, cb) {
	    },
	    get(event, context, cb) {
		this.genericService.getById(event.pathParameters.id);
	    },
	    update(event, context, cb) {
		this.genericService.update(event.body);
	    },
	    delete(event, context, cb) {
		this.genericService.delete(event.pathParameters.id);
	    }
	});

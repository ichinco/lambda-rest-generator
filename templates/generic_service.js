const stampit = require('stampit');
const moment = require('moment');

const Logger = require('../logger');

const GenericService = stampit()
    .refs({ table: null })
    .init((opts) => {
	    if (!opts.instance.table) throw new Error('table is required');
	})
    .methods({
	    getById(id) {
		return this.table
		.get(id)
		.execAsync()
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp.Items))
		.catch((err) => {
			this.log('Error running query', err);
			throw err;
		    });
	    },

	    getByIds(ids) {
		return this.table
		.getItems(ids)
		.execAsync()
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp.Items))
		.catch((err) => {
			this.log('Error running query', err);
			throw err;
		    });
	    },

	    createNew(obj) {
		this.table
		.create(obj)
		.execAsync()
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp.Items))
		.catch((err) => {
			this.log('Error running query', err);
			throw err;
		    });
	    },

	    update(obj) {
		this.table
		.update(obj)
		.execAsync()
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp.Items))
		.catch((err) => {
			this.log('Error running query', err);
			throw err;
		    });
	    },

	    delete(id) {
		this.table
		.destroy(id)
		.execAsync()
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp.Items))
		.catch((err) => {
			this.log('Error running query', err);
			throw err;
		    });
	    },

	    logResults(resp) {
		this.log('Found', resp.Count, 'items');
		this.log('Items: ', resp.Items);

		if (resp.ConsumedCapacity) {
		    this.log('Query consumed: ', resp.ConsumedCapacity);
		}

		return resp;
	    },

	    convertResults(items) {
		return items;
	    },
	})
    .compose(Logger);

module.exports = GenericService;
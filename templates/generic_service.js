const stampit = require('stampit');
const moment = require('moment');

const GenericService = stampit()
    .refs({ table: null })
    .init((opts) => {
	    if (!opts.instance.table) throw new Error('table is required');
	})
    .methods({
	    getById(id) {
		return this.table
		.getAsync(id)
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp))
		.catch((err) => {
			console.log('Error running query', err);
			throw err;
		    });
	    },

	    getByIds(ids) {
		return this.table
		.getItemsAsync(ids)
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp))
		.catch((err) => {
			console.log('Error running query', err);
			throw err;
		    });
	    },

	    createNew(obj) {
		return this.table
		.createAsync(obj)
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp))
		.catch((err) => {
			console.log('Error running query', err);
			throw err;
		    });
	    },

	    update(obj) {
		return this.table
		.updateAsync(obj)
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp))
		.catch((err) => {
			console.log('Error running query', err);
			throw err;
		    });
	    },

	    delete(id) {
		return this.table
		.destroyAsync(id)
		.then((resp) => this.logResults(resp))
		.then((resp) => this.convertResults(resp))
		.catch((err) => {
			console.log('Error running query', err);
			throw err;
		    });
	    },

	    logResults(resp) {
		console.log('Found', resp.Count, 'items');
		console.log('Items: ', resp);

		if (resp.ConsumedCapacity) {
		    console.log('Query consumed: ', resp.ConsumedCapacity);
		}

		return resp;
	    },

	    convertResults(items) {
		return items;
	    },
	});

module.exports = GenericService;
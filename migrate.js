const dynogels = require('dynogels');
const env = require('./env');

dynogels.AWS.config.update({region: "us-east-1"});

const config = require('./config/dev.json')
env(config);

const plan = require('./src/dynamodb/tables');

plan();

dynogels.createTables({
	$dynogels: { pollingInterval: 100 }
    }, function(err) {
	if (err) {
	    console.log('Error creating tables: ', err);
	} else {
	    console.log('Tables have been created');
	}
    });


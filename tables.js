const dynogels = require('dynogels');
const Joi = require('joi');

module.exports = () => {
    const planTableName = process.env.PLAN_TABLE_NAME;

    if (!planTableName) {
	throw new Error('Missing plan table name');
    }

    const Plan = dynogels.define('Plan', {
	    hashKey: 'PlanId',
	    schema: {
		PlanId: dynogels.types.uuid(),
		Timestamp: Joi.date(),
		Fields: Joi.array().items(Joi.object().keys({
			    FieldId: dynogels.types.uuid(),
			    FieldTitle: Joi.string(),
			    FieldText: Joi.string(),
			})),
	    },
	    tableName: planTableName,
	});

    return {
	Plan
	    };
};
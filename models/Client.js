var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Client Model
 * ==========
 */

var Client = new keystone.List('Client',
	{
		autokey: {from: 'email', path: 'key', unique: true}, sortable: true
	});

Client.relationship({path: 'work-orders', ref: 'WorkOrder', refPath: 'client'});
Client.add({
	username: { type: String, required: true, initial: true, index: true },
	password: { type: String, initial: true, required: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
});

/**
 * Registration
 */

Client.defaultColumns = 'name, email';
Client.register();


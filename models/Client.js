var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Client Model
 * ==========
 */

var Client = new keystone.List('Client',
	{
		autokey: {from: 'email', path: 'key', unique: true}, 
		sortable: true,
		map: {name: 'email'}
	});

Client.relationship({path: 'workOrders', ref: 'WorkOrder', refPath: 'client'});
Client.add({
	username: { type: String, required: true, initial: true, index: true },
	password: { type: String, initial: true, required: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	logo: {type: Types.CloudinaryImage,  autoCleanup : true}
});

/**
 * Registration
 */

Client.defaultColumns = 'email';
Client.register();


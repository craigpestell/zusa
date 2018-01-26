var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Country Model
 * ==========
 */

var Country = new keystone.List('Country',
	{
		autokey: {from: 'name', path: 'key', unique: true}, 
		sortable: true
	});

Country.relationship({path: 'workOrders', ref: 'WorkOrder', refPath: 'country'});
Country.add({
	name: { type: String, required: true, initial: true, index: true }
});

/**
 * Registration
 */

Country.defaultColumns = 'name';
Country.register();


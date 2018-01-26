var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Department Model
 * ==========
 */

var Department = new keystone.List('Department',
	{
		autokey: {from: 'name', path: 'key', unique: true}, 
		sortable: true
	});

Department.relationship({path: 'workOrders', ref: 'WorkOrder', refPath: 'department'});
Department.add({
	name: { type: String, required: true, initial: true, index: true }
});

/**
 * Registration
 */

Department.defaultColumns = 'name';
Department.register();


var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Client Model
 * ==========
 */

var Client = new keystone.List('Client',
	{
		autokey: { from: 'name', path: 'key', unique: true },
		sortable: true,
	});

Client.relationship({ path: 'workOrders', ref: 'WorkOrder', refPath: 'client' });
Client.add({
	name: { type: String, required: true, initial: true, index: true },
	username: { type: String, required: true, initial: true, index: true },
	password: { type: String, initial: true, required: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	logo: { type: Types.CloudinaryImage, autoCleanup: true },
	catalogs: { type: Types.Relationship, ref: 'WorkOrder', many: true, filters: { catalog: true } },

});
/* (Client.schema.pre('save', function(next){
	console.log(this);
	if(this.catalogLabel){
		this.autokey: {
			path: 'slug',
				from: 'name',
				unique: true,
				fixed: false
		}
	}
	next();
})*/
/**
 * Registration
 */

Client.defaultColumns = 'email';
Client.register();


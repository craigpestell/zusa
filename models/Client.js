var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Client Model
 * ==========
 */

var Client = new keystone.List('Client',
    {
        autokey: { from: 'name', path: 'key', unique: true }, sortable: true
    });

Client.relationship({ path: 'work-orders', ref: 'WorkOrder', refPath: 'work-orders' });
Client.add({
    name: { type: String, required: true, initial: true, index: true },
    email: { type: Types.Email, initial: true, required: true, index: true },
    password: { type: Types.Password, initial: true, required: true }
});

/**
 * Registration
 */

Client.defaultColumns = 'name, email';
Client.register();


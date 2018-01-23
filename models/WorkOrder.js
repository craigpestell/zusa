var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WorkOrder Model
 * ==========
 */

var WorkOrder = new keystone.List('WorkOrder');

WorkOrder.add({
    client: { type: Types.Relationship, ref: 'Client', required: true, initial: true, index: true},
    description: {type: String, index: true},
    dropDownField: {type: Types.Select, options: ['1','2']},
    catalog: {type: Boolean, note: 'Use this Work Order as a Catalogue item?'},
    catalogLabel: {type: String, dependsOn: {catalog: true}}

});
// Provide access to Keystone
WorkOrder.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});


/**
 * Registration
 */

WorkOrder.defaultColumns = 'name, email, isAdmin';
WorkOrder.register();

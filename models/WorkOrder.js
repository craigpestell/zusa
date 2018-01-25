var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WorkOrder Model
 * ==========
 */

var WorkOrder = new keystone.List('WorkOrder');

WorkOrder.add({
    client: { type: Types.Relationship, ref: 'Client', required: true, initial: true, index: true},
    description: {type: String, index: true, required: true, initial: true},
    dropDownField: {type: Types.Select, options: ['1','2']},
	status: { type: Types.Select, options: ['submitted','approved', 'cancelled', 'closed', 'inprogress'], default: 'submitted'},
    catalog: {type: Boolean, note: 'Use this Work Order as a Catalogue item?'},
    catalogLabel: {type: String, dependsOn: {catalog: true}}

});


WorkOrder.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

WorkOrder.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

WorkOrder.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var workorder = this;
	var brand = keystone.get('brand');

	keystone.list('Client').model.findOne({_id: workorder.client}).exec(function (err, client) {
		console.log('client: ', client)
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'workorder-notification',
			transport: 'mailgun',
		}).send({
			to: client.email,
			from: {
				name: 'Zusa',
				email: 'contact@zusa.com',
			},
			subject: 'New work order  for Zusa',
			workorder: workorder,
			brand: brand,
			layout: false,
		}, callback);
	});
};

/**
 * Registration
 */

WorkOrder.defaultColumns = 'client, status';
WorkOrder.register();

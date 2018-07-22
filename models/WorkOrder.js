var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WorkOrder Model
 * ==========
 */

var WorkOrder = new keystone.List('WorkOrder', {
	autokey: { path: 'key', from: 'name', unique: true },
	//drilldown: 'catalogLabel'
});

/*
* Requestor
* Department -dropdown
* crountry - dropdown
* city - dropdown
* postal / zip - dropdown
* location - dropdown
* position title - memo
* position skill set - memo
* compensation - drop down - 1. hourly, 2 weekly, 3 monthly 4 fixed
* compensation amount - memo
* */
WorkOrder.add({
	catalog: { type: Boolean, note: 'Use this Work Order as a Catalogue item?' },
	client: { type: Types.Relationship, ref: 'Client', required: true, initial: true, index: true, label: 'Requestor' },
	description: { type: String, index: true, required: true, initial: true },
	department: { type: Types.Relationship, ref: 'Department', index: true },
	country: { type: Types.Relationship, ref: 'Country', index: true },
	city: { type: String },
	postal: { type: String, label: 'Postal / Zip' },
	location: { type: String },
	positionTitle: { type: String },
	positionSkillSet: { type: String },
	compensation: { type: Types.Select, options: ['Hourly', 'Weekly', 'Monthly', 'Fixed'] },
	compensationAmount: { type: String },
	status: {
		type: Types.Select,
		options: ['submitted', 'approved', 'cancelled', 'closed', 'inprogress'],
		default: 'submitted',
	},
	name: { type: String, dependsOn: { catalog: true }, label: 'Catalog Label', index: true, unique: true },

});

WorkOrder.relationship({ ref: 'Client', refPath: 'catalogs', path: 'catalogs' });


WorkOrder.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

/* WorkOrder.schema.virtual('name').get(function(){
	return 'wtf'
});*/

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

	keystone.list('Client').model.findOne({ _id: workorder.client }).exec(function (err, client) {

		if (err) return callback(err);
		keystone.list('SiteSetting').model.findOne({ name: 'adminEmails' }).exec(function (err, emails) {

			var to = [{ email: client.email, name: client.email }];
			if (emails) {
				emails = emails.textValue.split(',');
				emails.forEach(function (email) {
					to.push({ email: email, name: email });
				});
			}
			console.log('to:', to);
			if (err) return callback(err);
			new keystone.Email({
				templateName: 'workorder-notification',
				transport: 'mailgun',
			}).send({
				to: to,
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

	});
};

WorkOrder.schema.pre('save', function (next) {
	console.log(this);
	if (this.name) {
		this.key = this.name.replace(/\s+/g, '-').toLowerCase();
	}
	next();
});

WorkOrder.schema.methods.clients = function (done) {
	return keystone.list('Client').model.find()
		.where({
			catalogs: {
				$in: [this._id],
			},
		})
		.exec(function (err, result) {
			console.log('Workorder clients:', result);
			done();
		});
};


/**
 * Registration
 */

WorkOrder.defaultColumns = 'client, status';
WorkOrder.register();

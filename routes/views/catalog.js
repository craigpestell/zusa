var keystone = require('keystone');

var mongoose = require('mongoose');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	if (req.query.clientid) {
		locals.clientid = req.query.clientid;
		console.log('clientid', locals.clientid);
	}
	// Set locals
	locals.section = 'catalog';
	// locals.workOrderTypes = WorkOrder.fields.workOrderType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.workOrderSubmitted = false;

	locals.data = {
		catalog: [],
		page: { title: 'My Catalog' },
	};


	view.on('init', function (next) {
		keystone.list('Client').model.find()
			.where({
				catalogs: {
					$in: [locals.clientid],
				},
			})
			.exec(function (err, result) {
				console.log('filtered results: ', result);
				next();

			});
	});

	// load the catalog data
	view.on('init', function (next) {
		var q = keystone.list('WorkOrder').model.find().where({ catalog: true });
		if (locals.clientid) {
			// Get all workorder catalog items for this client.
			var qc = keystone.list('Client').model.findOne(mongoose.Types.ObjectId(locals.clientid));
			qc.exec(function (err, result) {
				console.log('Client:', result);

				q = keystone.list('WorkOrder').model.find().where({ _id: { $in: result.catalogs } });
				q.exec(function (err, result) {
					console.log('WorkOrders:', result);
					locals.data.clientCatalogs = result;
					next(err);
				});
			});
		} else {
			next();
		}

		/* q.exec(function (err, result) {
			console.log('catalog data:', result);
			locals.data.clientCatalogs = result;
			next(err);
		});*/
	});

	// populate countries
	view.on('init', function (next) {
		var q = keystone.list('Country').model.find();

		q.exec(function (err, result) {
			locals.data.countries = result;
			next(err);
		});
	});


	view.render('catalog');
};

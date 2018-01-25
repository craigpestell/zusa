var keystone = require('keystone');
var WorkOrder = keystone.list('WorkOrder');
var mongoose = require('mongoose');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	console.log('req.query:', req.query);
	if (req.query.clientid) {
		locals.clientid = req.query.clientid;
		console.log('clientid', locals.clientid);
	}
	// Set locals
	locals.section = 'workorder';
	// locals.workOrderTypes = WorkOrder.fields.workOrderType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.workOrderSubmitted = false;

	locals.data = {
		catalog: [],
		page: {title: 'home'}
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('WorkOrder').model.find({catalog: true});

		q.exec(function (err, result) {
			locals.data.catalog = result;
			next(err);
		});

	});

	// On POST requests, add the WorkOrder item to the database
	view.on('post', {action: 'workorder'}, function (next) {

		var newWorkOrder = new WorkOrder.model();
		
		delete req.body.catalogLabel;
		delete req.body.catalog;
		req.body.catalog = false;

		var updater = newWorkOrder.getUpdateHandler(req);


		console.log('body:', req.body);


		WorkOrder.updateItem(newWorkOrder, req.body, function () {
			updater.process(req.body, {
				flashErrors: true,
				fields: 'description, dropDownField',
				errorMessage: 'There was a problem submitting your work order:',
			}, function (err) {
				if (err) {
					locals.validationErrors = err.errors;
					console.log('validationErrors;', locals.validationErrors)
				} else {
					locals.workOrderSubmitted = true;
				}
				next();
			});
		});
		//next();


	});

	view.render('workorder');
};

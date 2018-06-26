var keystone = require('keystone');

var Client = keystone.list('Client');

/**
 * List Clients
 */
exports.list = function(req, res) {
	Client.model.find(function(err, items) {

		if (err) return res.json({ err: err });

		res.json({
			clients: items
		});

	});
}

/**
 * Get Client by ID
 */
exports.get = function(req, res) {
	Client.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.json({ err: err });
		if (!item) return res.json('not found');

		res.json({
			client: item
		});

	});
}


/**
 * Create a Client
 */
exports.create = function(req, res) {

	var item = new Client.model(),
		data = (req.method == 'POST') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function(err) {

		if (err) return res.json({ error: err });

		res.json({
			client: item
		});

	});
}

/**
 * Patch Client by ID
 */
exports.update = function(req, res) {
	Client.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.json({ err: err });
		if (!item) return res.json({ err: 'not found' });

		var data = (req.method == 'PUT') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function(err) {

			if (err) return res.json({ err: err });

			res.json({
				client: item
			});

		});

	});
}

/**
 * Delete Client by ID
 */
exports.remove = function(req, res) {
	Client.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.json({ dberror: err });
		if (!item) return res.json('not found');

		item.remove(function (err) {
			if (err) return res.json({ dberror: err });

			return res.json({
				success: true
			});
		});

	});
}

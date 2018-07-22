var keystone = require('keystone');
var typeforce = require('typeforce');


var Client = keystone.list('Client');


module.exports = function (req, res) {
	try {
		typeforce({
			username: 'String',
			password: 'String',
		}, req.body, true);
	} catch (e) {
		return res.jfin(e);
	}

	Client.model.findOne({ username: req.body.username, password: req.body.password }, function (err, client) {
		if (err) return res.jfin(err);
		if (!client) return res.jfin(new Error('Invalid login'));
		res.status(200).json({ client: client });
		// res.jfin(null, {id: client.id});
		// return {id: client._id};
		/* new ScheduleItemFeedback.model({
			talk: req.body.id,
			author: client.id,
			type: req.body.type,
			feedback: req.body.text
		}).save(function (err) {
			res.jfin(err);
		});*/
	});
	Client.model.find(function (err, client) {
		console.log(client);
	});
};

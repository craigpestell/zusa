var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'logout';
	req.flash('success', { detail: 'You have logged out' });
	view.render('login');
};

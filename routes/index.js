var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var api = importRoutes('./api');
var views = importRoutes('./views');

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', views.index);
	app.all('/contact', views.contact);
	app.all('/login', views.login);
	app.all('/logout', views.logout);
	app.all(['/workorder'], views.workorder);

	app.use('/api', function (req, res, next) {
		res.jfin = function (err, data) {
			console.log('err:', err, 'data:', data);
			res.status(err ? 400 : 200)
			res.json({
				error: (err && err.message) || undefined,
				success: err ? undefined : true,
				data: data
			});
		};

		next();
	});

	app.post('/api/login', api.client.login);
	app.get(['/api/catalog', '/api/catalog/:id'], api.workorder.catalog);
	/* app.post('/api/me/feedback', api.feedback);
	app.post('/api/me/update', api.update);
	app.post('/api/synchronize', api.synchronize);*/
};

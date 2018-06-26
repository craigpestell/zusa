var keystone = require('keystone');
var middleware = require('./middleware');
var routes = keystone.importer(__dirname);
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var api = routes('./api');
var views = routes('./views');

// Setup Route Bindings
exports = module.exports = function (app) {

	var authCheck = jwt({
		secret: jwks.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			// YOUR-AUTH0-DOMAIN name e.g https://prosper.auth0.com
			jwksUri: 'https://zusa.auth0.com/.well-known/jwks.json',
		}),
		// This is the identifier we set when we created the API
		// audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
		audience: 'http://localhost:3001/',
		issuer: 'https://zusa.auth0.com',
		algorithms: ['RS256']
	});
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

	// app.post('/api/login', api.client.login);
	app.get(['/api/catalog', '/api/catalog/:id'], api.workorder.catalog);

	app.get('/api/client', api.client.list);
	app.get('/api/client/:id', api.client.get);
	app.post('/api/client', api.client.create);
	app.put('/api/client/:id', api.client.update);
	app.delete('/api/client/:id', api.client.remove);
	/* app.post('/api/me/feedback', api.feedback);
	app.post('/api/me/update', api.update);
	app.post('/api/synchronize', api.synchronize);*/
};

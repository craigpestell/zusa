var keystone = require('keystone');
var typeforce = require('typeforce');


var Wo = keystone.list('WorkOrder');


module.exports = function (req, res) {
	/* try {
		typeforce({
			id: 'String'
		}, req.params.id, true);
	} catch (e) {
		return res.jfin(e);
	}*/
	if(req.params.id){
		Wo.model.findOne({ _id: req.params.id }, function (err, wo) {
			if (err) return res.jfin(err)
			if (!wo) return res.jfin(new Error('Invalid login'));
			res.jfin(null, {workOrders: wo});
		});
	}else{
		Wo.model.find({ catalog: true }, function (err, wo) {
			if (err) return res.jfin(err)
			if (!wo) return res.jfin(new Error('Invalid login'));
			res.jfin(null, {workOrders: wo});
		});
	}

};

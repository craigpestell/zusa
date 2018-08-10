var keystone = require('keystone');
var mongoose = require('mongoose');


var Wo = keystone.list('WorkOrder');


module.exports = function(req, res) {
    /* try {
    	typeforce({
    		id: 'String'
    	}, req.params.id, true);
    } catch (e) {
    	return res.jfin(e);
    }*/
    // console.log('params: ', req.params);
    // console.log('query: ', req.query);
    if (req.params.id) {
        Wo.model.findOne({ _id: req.params.id }, function(err, wo) {
            if (err) return res.jfin(err);
            if (!wo) return res.jfin(new Error('Invalid login'));
            res.jfin(null, wo);
        });
    } else {
        if (req.query.clientid) {

            // console.log('clientid param:: ', req.query.clientid);
            var qc = keystone.list('Client').model.findOne(mongoose.Types.ObjectId(req.query.clientid));
            qc.exec(function(err, result) {
                // console.log('client:', result);
                var q = keystone.list('WorkOrder').model.find().where({ _id: { $in: result.catalogs } });
                q.exec(function(err, result) {
                    res.jfin(null, { workOrders: result });
                });
            });
            Wo.model.find({ catalog: true }, function(err, wo) {
                if (err) return res.jfin(err);
                if (!wo) return res.jfin(new Error('Invalid login'));
            });
        } else {
            return res.jfin(new Error('invalid clientid parameter'));
        }

    }

};
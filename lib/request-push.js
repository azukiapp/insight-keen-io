'use strict';

var lodash  = require('lodash');
var request = require('request');
var async   = require('async');
var InsightKeenIo = require('./');

module.exports = function (msg, parent_callback) {
	var insight = new InsightKeenIo(msg);
	var results = [];

	async.eachSeries(lodash.values(msg.queue), function (item, cb) {
		var options = insight.requestParams(item.collection, item.event);
		request(options, function (err, res, body) {
			if (err) {
				return cb(err);
			}
			results.push(body);
			cb();
		});
	}, function (err) {
		parent_callback(results);
	});
};

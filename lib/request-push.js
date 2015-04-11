'use strict';

var request = require('request');
var async = require('async');
var assign = require('object-assign');
var InsightKeenIo = require('./');
var _ = require('lodash');

module.exports = function (msg, parent_callback) {
	var eventCollection = msg.eventCollection;
	var analyticsData = msg.data;

	var insight = new InsightKeenIo(msg);
	var config = insight.config;
	var queue = config.get('queue') || {};

	assign(queue, msg.queue);
	config.del('queue');
	var results = [];

	async.eachSeries(_.values(queue), function (item, cb) {

		var options = insight._getRequestObj(eventCollection, analyticsData);
		request(options, function (err, res, body) {
			if (err) {
				console.error(err);
				cb(err);
				return;
			}

			results.push(body);
			cb();
		});

	}, function (err) {

		if (err) {
			var queue2 = config.get('queue') || {};
			assign(queue2, queue);
			config.set('queue', queue2);
			console.error(err);
		}

		parent_callback(results);
	});
};

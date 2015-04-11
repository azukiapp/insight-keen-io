'use strict';
var request = require('request');
var async = require('async');
var assign = require('object-assign');
var InsightKeenIo = require('./');

// Messaged on each debounced track()
// Gets the queue, merges is with the previous and tries to upload everything
// If it fails, it will save everything again
process.on('message', function (msg) {
	var eventCollection = msg.eventCollection;
	var analyticsData = msg.data;

	var insight = new InsightKeenIo(msg);
	var config = insight.config;
	var queue = config.get('queue') || {};

	assign(queue, msg.queue);
	config.del('queue');

	console.log('queue=', queue);


	async.forEachSeries(Object.keys(queue), function (cb) {

		var options = insight._getRequestObj(eventCollection, analyticsData);
		request(options, function (err, res, body) {
			if (err) {
				console.error(err);
				cb(err);
				return;
			}

			console.log('body result:', body);

			if (typeof cb === 'function') {
				cb();
			}
		});

	}, function (err) {

		if (err) {
			var queue2 = config.get('queue') || {};
			assign(queue2, queue);
			config.set('queue', queue2);
			console.error(err);
		}

		process.exit(0);

	});
});

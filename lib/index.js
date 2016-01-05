'use strict';

var path   = require('path');
var spawn  = require('child_process').spawn;
var lodash = require('lodash');
var providers = require('./providers');

function InsightKeenIo (options) {
	options = options || {};

	if (!options.projectId || !options.writeKey) {
		throw new Error('projectId and writeKey required');
	}

	this.trackingProvider = 'keen';
	this.writeKey = options.writeKey;
	this.projectId = options.projectId;

	if (typeof options.send_in_background === 'boolean') {
		this.send_in_background = options.send_in_background;
	} else {
		this.send_in_background = true;
	}

	this._queue = {};
}

// debounce in case of rapid .track() invocations
InsightKeenIo.prototype._save = lodash.debounce(function() {
	var child = spawn('node', [path.join(__dirname, 'push.js')], {
		detached: true,
		stdio   : [null, process.stdout, process.stdout, 'pipe'],
	});

	// Send configs to child
	var pipe = child.stdio[3];
	var buff = Buffer(JSON.stringify(this._getPayload()));
	pipe.write(buff);

	child.unref();
	this._queue = {};
}, 100);

InsightKeenIo.prototype._getPayload = function () {
	return {
		queue: lodash.clone(this._queue),
		projectId: this.projectId,
		writeKey: this.writeKey,
	};
};

InsightKeenIo.prototype.requestParams = function () {
	return providers[this.trackingProvider].apply(this, arguments);
};

InsightKeenIo.prototype.track = function (eventCollection, data, callback) {
	// timestamp isn't unique enough since it can end up with duplicate entries
	this._queue[Date.now() + ' ' + eventCollection] = {
		collection: eventCollection,
		event: data,
	};

	if (!this.send_in_background) {
		var requestPush = require('./request-push');
		requestPush(this._getPayload(), callback);
	} else {
		this._save();
		callback(null, 0);
	}
};

module.exports = InsightKeenIo;

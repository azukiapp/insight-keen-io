'use strict';
var path = require('path');
var spawn = require('child_process').spawn;
var Configstore = require('configstore');
var assign = require('object-assign');
var debounce = require('lodash.debounce');
var providers = require('./providers');
var BPromise = require("bluebird");

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

	var clientId = options.clientId || Math.floor(Date.now() * Math.random());
	var config_store_name = 'InsightKeenIo-' + this.projectId;

	this.config = options.config || new Configstore(config_store_name, {clientId: clientId});

	this._queue = {};
}

Object.defineProperty(InsightKeenIo.prototype, 'clientId', {
	get: function () {
		return this.config.get('clientId');
	},
	set: function (val) {
		this.config.set('clientId', val);
	}
});

// debounce in case of rapid .track() invocations
InsightKeenIo.prototype._save = debounce(function (save_cb) {
	if (this.send_in_background) {
		var child = spawn('node', [path.join(__dirname, 'push.js')], {
			detached: true,
			stdio   : [null, null, null, 'pipe'],
		});

		// Send configs to child
		var pipe = child.stdio[3];
		var buff = Buffer(JSON.stringify(this._getPayload()));
		pipe.write(buff);

		child.unref();
		this._queue = {};

		return save_cb(0);
	} else {
		var requestPush = require('./request-push');
		requestPush(this._getPayload(), save_cb);
	}

}, 100);

InsightKeenIo.prototype._getPayload = function () {
	return {
		queue: assign({}, this._queue),

		projectId: this.projectId,
		writeKey: this.writeKey,

		eventCollection: this._eventCollection,
		data: this._data,
	};
};

InsightKeenIo.prototype._getRequestObj = function () {
	return providers[this.trackingProvider].apply(this, arguments);
};

InsightKeenIo.prototype.track = function (eventCollection, data) {
	var deferred = BPromise.pending();

	// timestamp isn't unique enough since it can end up with duplicate entries
	this._eventCollection = eventCollection;
	this._data = data;
	this._queue[Date.now() + ' ' + eventCollection] = data;

	this._save(function (result) {
		deferred.fulfill(result);
	});

	return deferred.promise;
};

module.exports = InsightKeenIo;

'use strict';
var path = require('path');
var fork = require('child_process').fork;
var Configstore = require('configstore');
var chalk = require('chalk');
var assign = require('object-assign');
var debounce = require('lodash.debounce');
var inquirer = require('inquirer');
var providers = require('./providers');

function InsightKeenIo (options) {
	options = options || {};

	if (!options.projectId || !options.writeKey) {
		throw new Error('projectId and writeKey required');
	}

	this.trackingProvider = 'keen';
	this.writeKey = options.writeKey;
	this.projectId = options.projectId;

	this.config = options.config || new Configstore('InsightKeenIo-' + this.projectId, {
		clientId: options.clientId || Math.floor(Date.now() * Math.random())
	});

	this._queue = {};
}

Object.defineProperty(InsightKeenIo.prototype, 'optOut', {
	get: function () {
		return this.config.get('optOut');
	},
	set: function (val) {
		this.config.set('optOut', val);
	}
});

Object.defineProperty(InsightKeenIo.prototype, 'clientId', {
	get: function () {
		return this.config.get('clientId');
	},
	set: function (val) {
		this.config.set('clientId', val);
	}
});

// debounce in case of rapid .track() invocations
InsightKeenIo.prototype._save = debounce(function () {
	var cp = fork(path.join(__dirname, 'push.js'), {silent: true});
	cp.send(this._getPayload());
	cp.unref();
	cp.disconnect();

	this._queue = {};
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
	if (this.optOut) {
		return;
	}

	// timestamp isn't unique enough since it can end up with duplicate entries
	this._eventCollection = eventCollection;
	this._data = data;
	this._queue[Date.now() + ' ' + eventCollection] = data;
	this._save();
};

InsightKeenIo.prototype.askPermission = function (msg, cb) {
	var defaultMsg = 'May ' + chalk.cyan(this.packageName) + ' anonymously report usage statistics to improve the tool over time?';

	cb = cb || function () {};

	if (!process.stdout.isTTY) {
		setImmediate(cb, null, false);
		return;
	}

	inquirer.prompt({
		type: 'confirm',
		name: 'optIn',
		message: msg || defaultMsg,
		default: true
	}, function (result) {
		this.optOut = !result.optIn;
		cb(null, result.optIn);
	}.bind(this));
};

module.exports = InsightKeenIo;

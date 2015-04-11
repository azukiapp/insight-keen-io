/*global describe, it, beforeEach */
'use strict';
var assert = require('assert');
var spawn = require('child_process').spawn;
var sinon = require('sinon');
var objectValues = require('object-values');
var InsightKeenIo = require('../lib');

describe('InsightKeenIo()', function () {
	var insight = new InsightKeenIo({
		projectId: 'YOUR_PROJECT_ID',
		writeKey: 'YOUR_WRITE_KEY'
	});

	// it('should put tracked path in queue', function (cb) {
	// 	var dataGiven = {
	// 		"event_type" : "start",
	// 		"sessionId"  : "azk_agent_session_id_3890217389127389",
	// 		"ip_address" : "${keen.ip}",
	// 	};
	//
	// 	InsightKeenIo.prototype._save = function() {
	// 		assert.equal(dataGiven, objectValues(this._queue)[0]);
	// 		cb();
	// 	};
	//
	// 	insight.track("agent", dataGiven);
	// });

	it('should track work without fork', function (done) {

		var insight = new InsightKeenIo({
			projectId: '5526968d672e6c5a0d0ebec6',
			writeKey: '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054617863832309c14a797409e12d976630c3a4b479004f26b362506e82a46dd54df0c977a7378da280c05ae733c97abb445f58abb56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768',
			use_fork: false
		});

		var dataGiven = {
			"sessionId"  : "azk_agent_session_id_3890217389127389",
			"ip_address" : "${keen.ip}",
		};

		insight.track("FROM_TEST", dataGiven, function (data) {
			assert.ok(data[0].created);
			done();
		});

	});

	it('should track work without fork', function (done) {

		var insight = new InsightKeenIo({
			projectId: '5526968d672e6c5a0d0ebec6',
			writeKey: '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054617863832309c14a797409e12d976630c3a4b479004f26b362506e82a46dd54df0c977a7378da280c05ae733c97abb445f58abb56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768',
			use_fork: false
		});

		var dataGiven = {
			"ip_address" : "${keen.ip}",
		};

		insight.track("FROM_TEST", dataGiven, function (data) {
			assert.ok(data[0].created);
			done();
		});

	});

	it('should track work with fork', function (done) {

		var insight = new InsightKeenIo({
			projectId: '5526968d672e6c5a0d0ebec6',
			writeKey: '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054617863832309c14a797409e12d976630c3a4b479004f26b362506e82a46dd54df0c977a7378da280c05ae733c97abb445f58abb56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768',
			use_fork: true
		});

		var dataGiven = {
			"ip_address" : "${keen.ip}",
		};

		insight.track("FROM_TEST_WITH_FORK", dataGiven, function (is_ok) {
			assert.ok(is_ok);
			done();
		});

	});


	it('should throw exception when trackingCode or packageName is not provided', function (cb) {
		assert.throws(function () {
			new InsightKeenIo({});
		}, Error);

		assert.throws(function () {
			new InsightKeenIo({ projectId: 'YOUR_PROJECT_ID' });
		}, Error);

		assert.throws(function () {
			new InsightKeenIo({ writeKey: 'YOUR_WRITE_KEY' });
		}, Error);

		cb();
	});
});

describe('config providers', function () {
	beforeEach(function () {
		var write_key_string = '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054617863832309c14a797409e12d976630c3a4b479004f26b362506e82a46dd54df0c977a7378da280c05ae733c97abb445f58abb56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768';

		this.config = {
			get: sinon.spy(function () {
				return true;
			}),
			set: sinon.spy()
		};

		this.insight = new InsightKeenIo({
			projectId: '5526968d672e6c5a0d0ebec6',
			writeKey: write_key_string,
			config: this.config
		});
	});

	it('should access the config object for reading', function () {
		assert(this.insight.optOut);
		assert(this.config.get.called);
	});

	it('should access the config object for writing', function () {
		var sentinel = {};
		this.insight.optOut = sentinel;
		assert(this.config.set.calledWith('optOut', sentinel));
	});
});

describe('askPermission', function () {
	it('should skip in TTY mode', function (done) {
		var insProcess = spawn('node', [
			'./test/fixtures/sub-process.js'
		]);
		insProcess.on('close', function (code) {
			assert.equal(code, 145);
			done();
		});
	});
});

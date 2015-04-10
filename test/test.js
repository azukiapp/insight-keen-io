/*global describe, it, beforeEach */
'use strict';
var assert = require('assert');
var qs = require('querystring');
var spawn = require('child_process').spawn;
var osName = require('os-name');
var sinon = require('sinon');
var objectValues = require('object-values');
var Insight = require('../lib');

describe('Insight()', function () {
	var insight = new Insight({
		projectId: 'YOUR_PROJECT_ID',
		writeKey: 'YOUR_WRITE_KEY'
	});

	it('should put tracked path in queue', function (cb) {
		var dataGiven = {
			"event_type" : "start",
			"sessionId"  : "azk_agent_session_id_3890217389127389",
			"ip_address" : "${keen.ip}",
		};

		Insight.prototype._save = function() {
			assert.equal(dataGiven, objectValues(this._queue)[0]);
			cb();
		};

		insight.track("agent", dataGiven);
	});

	it('should throw exception when trackingCode or packageName is not provided', function (cb) {
		assert.throws(function () {
			new Insight({});
		}, Error);

		assert.throws(function () {
			new Insight({ projectId: 'YOUR_PROJECT_ID' });
		}, Error);

		assert.throws(function () {
			new Insight({ writeKey: 'YOUR_WRITE_KEY' });
		}, Error);

		cb();
	});
});

describe('providers', function () {
	var ver = '0.11.5'

	describe('Keen IO', function () {
		var insight = new Insight({
			projectId: '5526968d672e6c5a0d0ebec6',
			writeKey: '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054617863832309c14a797409e12d976630c3a4b479004f26b362506e82a46dd54df0c977a7378da280c05ae733c97abb445f58abb56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768'
		});

		it('should form valid request', function () {
			var reqObj = insight._getRequestObj();
			var _qs = qs.parse(reqObj.body);

			assert.equal(_qs.tid, code);
			assert.equal(_qs.cid, insight.clientId);
			assert.equal(_qs.dp, path);
			assert.equal(_qs.cd1, osName());
			assert.equal(_qs.cd2, process.version);
			assert.equal(_qs.cd3, ver);
		});

		// please see contributing.md
		it('should show submitted data in Real Time dashboard, see docs on how to manually test');
	});

});

describe.skip('config providers', function () {
	beforeEach(function () {
		var pkg = 'yeoman';
		var ver = '0.0.0';

		this.config = {
			get: sinon.spy(function () {
				return true;
			}),
			set: sinon.spy()
		};

		this.insight = new Insight({
			trackingCode: 'xxx',
			packageName: pkg,
			packageVersion: ver,
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

describe.skip('askPermission', function () {
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

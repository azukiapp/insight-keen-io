/*global describe, it, beforeEach */
'use strict';
var assert = require('assert');
var sinon = require('sinon');
var InsightKeenIo = require('../lib');

describe('InsightKeenIo()', function () {
	it('should track work without fork', function (done) {
		this.timeout(10000);
		var insight = new InsightKeenIo({
			projectId         : '5526968d672e6c5a0d0ebec6',
			writeKey          : '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054617863832309c14a797409e12d976630c3a4b479004f26b362506e82a46dd54df0c977a7378da280c05ae733c97abb445f58abb56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768',
			send_in_background: false
		});

		var dataGiven = {
			"ip_address" : "${keen.ip}",
		};

		insight.track("FROM_TEST", dataGiven, function(err, data) {
			assert.ok(data[0].created);
			done();
		});
	});

	it('should track work with fork', function (done) {
		this.timeout(10000);
		var insight = new InsightKeenIo({
			projectId         : '5526968d672e6c5a0d0ebec6',
			writeKey          : '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054617863832309c14a797409e12d976630c3a4b479004f26b362506e82a46dd54df0c977a7378da280c05ae733c97abb445f58abb56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768',
			send_in_background: true
		});

		var dataGiven = {
			"ip_address" : "${keen.ip}",
		};

		insight.track("FROM_TEST_WITH_FORK", dataGiven, function (err, is_zero) {
			assert.equal(is_zero, 0);
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
});

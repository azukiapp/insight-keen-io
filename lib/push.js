'use strict';

var net  = require('net');
var JStream = require('jstream');

var stream  = new net.Socket({ fd: 3 });
let jstream = new JStream();

stream.pipe(jstream).on('data', function(data) {
	var request_push = require('./request-push');
	request_push(data, function (results) {
		stream.end();
		process.exit(0);
	});
});

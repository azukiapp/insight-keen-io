'use strict';

var net  = require('net');
var pipe = new net.Socket({ fd: 3 });
pipe.on('data', function (buf) {
	var data = JSON.parse(buf.toString('utf8'));
	var request_push = require('./request-push');
	request_push(data, function (results) {
		pipe.end();
		process.exit(0);
	});
});

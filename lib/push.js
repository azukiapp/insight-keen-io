'use strict';

var request_push = require('./request-push');

// Messaged on each debounced track()
// Gets the queue, merges is with the previous and tries to upload everything
// If it fails, it will save everything again
process.on('message', function (data) {
	/**/console.log('\n>>---------\n data:\n', data, '\n>>---------\n');/*-debug-*/
	request_push(data, function (results) {
		console.log(results);
		/**/console.log('\n>>---------\n results:\n', results, '\n>>---------\n');/*-debug-*/
		process.exit(0);
	});
});

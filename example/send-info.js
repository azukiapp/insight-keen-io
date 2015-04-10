'use strict';
var Insight = require('../lib');

var insight = new Insight({
	projectId: '5526968d672e6c5a0d0ebec6',
	writeKey: '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054617863832309c14a797409e12d976630c3a4b479004f26b362506e82a46dd54df0c977a7378da280c05ae733c97abb445f58abb56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768'
});

// FIXME: must be stored
// insight.askPermission('Do you accept?', function () {
// 	var tracking_allowed = !(insight.optOut);
// 	trackIt();
// });

trackIt();

function trackIt() {
	var result = insight.track('SUBJECT', {
		event_type: 'pull',
		state: 'ok',
		reason: '',
		manifest_id: 'azk_12371892',
		images: {
			type: 'docker',
			name: 'azukiapp/node:0.12.0'
		},
		"keen" : {
      "addons" : [
        {
          "name" : "keen:ip_to_geo",
          "input" : {
            "ip" : "ip_address"
          },
          "output" : "ip_geo_info"
        }
      ]
    },
    "ip_address" : "${keen.ip}"
	});
}

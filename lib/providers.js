'use strict';

/**
 * Tracking providers.
 *
 * Each provider is a function(id, path) that should return
 * options object for request() call. It will be called bound
 * to InsightKeenIo instance object.
 */

module.exports = {
	// Keen IO
  keen: function (eventCollection, analyticsData) {
    var options = {
      url: 'https://api.keen.io/3.0/projects/' + this.projectId + '/events/' + eventCollection + '?api_key=' + this.writeKey,
      method: 'POST',
			json: true,
	    headers: {
	        "content-type": "application/json",
	    },
	    body: analyticsData
    };

		return options;
  }

};

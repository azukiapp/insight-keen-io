'use strict';

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

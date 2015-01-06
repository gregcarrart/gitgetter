/*
	# Endpoint URL #
	
	https://api.github.com/legacy/repos/search/{query}
	
	Note: Github imposes a rate limit of 60 request per minute. Documentation can be found at http://developer.github.com/v3/.
	
	# Example Response JSON #
	
	{
	  "meta": {...},
	  "data": {
		"repositories": [
		  {
			"type": string,
			"watchers": number,
			"followers": number,
			"username": string,
			"owner": string,
			"created": string,
			"created_at": string,
			"pushed_at": string,
			"description": string,
			"forks": number,
			"pushed": string,
			"fork": boolean,
			"size": number,
			"name": string,
			"private": boolean,
			"language": number
		  },
		  {...},
		  {...}
		]
	  }
	}
*/

(function($) {
	var searchTerm,
		results = [];
	
	var Result = function(term, results) {
		this.term = term;
		this.results = results;
	};

	var gitGet = {
		el: {
			$form 					: $('#search-form'),
			$resultsContainer		: $('#results-container'),
			$overlayContainer		: $('#overlay-container'),
			$searchTerm   			: $('.search-field')
		},
		init: function() {
			gitGet.el.$form.submit(function(e) {
  				e.preventDefault();
  				searchTerm = gitGet.el.$searchTerm.val();

  				results.push(new Result(searchTerm, null));

  				console.log(results);
			});

		},
		findSearchTerm: function(value) {
			return _.find(results, function(term) {
  				return term.match(new RegExp(value,"i"));
  			});
		}
	};

	gitGet.init();

})(jQuery);
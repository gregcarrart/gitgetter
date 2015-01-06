/*
	# Endpoint URL #
	
	https://api.github.com/legacy/repos/search/{query}
*/

(function($) {
	var searchTerm,
		apiPageUrl,
		results = [],
		items = '',
		modalContent = '',
		firstQuery = true;
	
	var Result = function(term, results) {
		this.term = term;
		this.results = results;
	};

	var gitGet = {
		el: {
			$form 					: $('#search-form'),
			$resultsContainer		: $('#results-container'),
			$overlayContainer		: $('#overlay-container'),
			$searchTerm   			: $('.search-field'),
			$modalCover             : $('.modal-cover')
		},
		init: function() {
			gitGet.el.$form.submit(function(e) {
  				e.preventDefault();
  				searchTerm = gitGet.el.$searchTerm.val().toLowerCase();

  				//check array for duplicates
  				var repeatCheck = $.grep(results, function(e) {
  					return e.term === searchTerm;
  				});

  				gitGet.el.$resultsContainer.html('');

  				if (repeatCheck.length === 0) {
  					firstQuery = true;
  					results.push(new Result(searchTerm, null)); //if original, push to results array
  					gitGet.getData(searchTerm);
  				} else {
  					firstQuery = false;
  					gitGet.retrieveData(searchTerm); //else retrieve existing array data
  				}
  				
			});

		},
		getData: function(searchTerm) {
            apiPageUrl = 'https://api.github.com/legacy/repos/search/' + searchTerm;
    
            $.ajax({
                type: 'GET',
                url : apiPageUrl,
                dataType: 'jsonp',
                success: function(data) {
	                gitGet.setData(data, searchTerm);
	            }   
            });
		},
		retrieveData: function(searchTerm) {
			for (var i = 0; i < results.length; i++) {
				if (results[i].term === searchTerm) {
					var data = results[i].results;
					gitGet.setData(data, searchTerm);
				}
			}
		},
		setData: function(data, searchTerm) {
			if (data.data.repositories.length === 0) {
				gitGet.el.$resultsContainer.append('<h2>Sorry, no results found.</h2>');
			}
			$.each(data.data.repositories, function() {

                var repoName     	= this.name,
                	repoOwner	 	= this.owner,
                	repoLang	 	= this.language,
                	repoFollowers	= this.followers,
                	repoUrl			= this.url,
                	repoDesc		= this.description;


                items = '<div class="item" data-lang="'+repoLang+'" data-followers="'+repoFollowers+'" data-url="'+repoUrl+'" data-desc="'+repoDesc+'"><div class="repo-name"><span>'+repoName+'</span></div><div class="repo-owner"><span>'+repoOwner+'</span></div></div>';

                gitGet.el.$resultsContainer.append(items);
 
            });

			gitGet.events();

			//find search term and asscoiate only if first query is true
			if (firstQuery) {
				for (var i = 0; i < results.length; i++) {
					if (results[i].term === searchTerm) {
						results[i].results = data;
						break;
					}
				}
			}
		},
		events: function() {
			$('.item').on('click', function() {
				var $this 			= $(this),
					title			= $this.find('.repo-name').find('span').html(),
					owner 			= $this.find('.repo-owner').find('span').html(),
		            dataLang    	= $this.attr('data-lang'),
		            dataFollowers 	= $this.attr('data-followers'),
		            dataUrl   		= $this.attr('data-url'),
		            dataDesc 		= $this.attr('data-desc');

		        gitGet.openModal(title, owner, dataLang, dataFollowers, dataUrl, dataDesc);
			});

			gitGet.el.$modalCover.on('click', gitGet.closeModal);
		},
		openModal: function(title, owner, dataLang, dataFollowers, dataUrl, dataDesc) {

			modalContent = '<div class="modal"><div class="modal-close">X</div><div class="modal-title">'+title+'</div><div class="modal-owner"><a href="http://github.com/'+owner+'" target="_blank">'+owner+'</a></div><hr /><div class="modal-lang modal-text">Language: '+dataLang+'</div><div class="modal-followers modal-text">Followers: '+dataFollowers+'</div><div class="modal-url modal-text">URL: <a href="'+dataUrl+'" target="_blank">'+dataUrl+'</a></div><div class="modal-desc modal-text">Description: '+dataDesc+'</div></div>';

			gitGet.el.$overlayContainer.append(modalContent);

			gitGet.el.$modalCover.fadeIn(300);
			gitGet.el.$overlayContainer.fadeIn(300);

			$('.modal-close').on('click', function() {
				gitGet.closeModal();
			});
		},
		closeModal: function() {
			gitGet.el.$modalCover.fadeOut(300);
			gitGet.el.$overlayContainer.fadeOut(300);
			gitGet.el.$overlayContainer.html('');
		}
	};
	//init app!!!!
	gitGet.init();

})(jQuery);
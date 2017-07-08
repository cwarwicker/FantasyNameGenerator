var _dfNameGenVars = {};
_dfNameGenVars.sources = {};

(function($) {

	$.fn.dfNameGen = function(url, options){
		
		var settings = $.extend(
			{
				limit: 10,
				separator: '<br>'
			}, options
		);

		var retries = 0;
		var el = this;
		var results = [];
		var last = '';
                                
		var generate = function(source){

			// Generator
			for (var i = 0; i < settings.limit; i++)
			{
			 
				// Pick a random format
				var format = source.formats[Math.floor(Math.random()*source.formats.length)];
					   
				// Build the string
				var str = format.replace(/\$(\d+|[a-z]+)/g, function(match, capture){
					   					
					var arr = source.names[capture];
					var el = arr[Math.floor(Math.random()*arr.length)];
					
					// We don't want the same string twice in a row, e.g. "riverriver", although it it's 2 or less characters, we can accept that.
					while (el.length > 2 && el === last){
						el = arr[Math.floor(Math.random()*arr.length)];
					}
					
					last = el;
					
					return el;
					   
				});
                                
                                // Capitalise first letter of each word
				var arr = str.split(" ");
				$(arr).each( function(k, i){
					arr[k] = arr[k].charAt(0).toUpperCase() + arr[k].slice(1).toLowerCase();
				} );
				str = arr.join(" ");
				
				// If we haven't already got this exact one, append to results array
				if (results.indexOf(str) < 0){
					results.push(str);
					retries = 0;
				} else {
					
					// if we have already got this exact one, try again to find a new one, unless we have already tried this 10 times, in which case give up and move on
					if (retries < 10){
						retries++;
						i--;
					}
					
				}				
			 
			}
			
			results.sort();
			$(el).html( results.join(settings.separator) );
			
		};
		
		
		// Have we already loaded this source?
		if (_dfNameGenVars.sources[url] !== undefined){
			generate(_dfNameGenVars.sources[url]);
		} else {
		
			// Check for errors
			$.getJSON(url, function(source){
							
				
				if ( $.isEmptyObject(source.names) ){
					console.debug('dfNameGen ERR: Names not specified');
					return false;
				}
				
				if (source.formats.length == 0){
					console.debug('dfNameGen ERR: Formats not specified');
					return false;
				}

				// Save source for faster generating
				_dfNameGenVars.sources[url] = source;
								
				// Generate names				
				generate(source);				
				
				
			}).fail( function(){
				
				console.debug('dfNameGen ERR: Could not load source JSON');
				return false;
				
			} );
		
		}
		
				
		return this;

	};

}(jQuery));



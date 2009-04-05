
(function($) {
    
    /**
     * Performs a query to the Twitter search API and fills a jQuery object with the results
     * @param query_string The string of the query
     * @param options An object with user defined options.
     * @return a jQuery object
     */
    $.fn.twitterSearch = function(query_string, options) {
        var opts = $.extend({}, $.fn.twitterSearch.defaults, options);
        
        var jObject = this; // We will use this for the success and error callbacks
        
        // Do the Twitter API call
        $.ajax({
            url: 'http://search.twitter.com/search.json',
            data: {
                q: query_string,
                rpp: opts.results
            },
            dataType: 'jsonp',
            success: function(data, status) {
                renderInto(jObject, data, opts);
            },
            error: function() {
                // TODO
            }
        });
        
        return this;
    };
    
    // Default settings
    $.fn.twitterSearch.defaults = {
        results: 20,
        avatar: true
    };
    
    
    /**
     * Renders the data returned from Twitter into each jQuery object
     * @param jObject The jQuery object where the data must be appended.
     * @param data The data itself
     * @param opts Options object from the constructor
     */
    function renderInto(jObject, data, opts) {
        jObject.each(function() {
            
            if (data.results.length == 0) {
                $('<div>')
                    .addClass('tweetersearch-info')
                    .html('No matches for ' + data.query)
                    .appendTo(this);
                
                return;
            }
            
            if (this.tagName.toLowerCase() != 'ul') {
                var list = $('<ul>').appendTo(this);
            }
            else {
                var list = $(this);
            }
            list.addClass('twittersearch-list');
            console.log(data);
            
            
            $(data.results).each(function(i, twitt) {
                var li = $('<li>');
                if (opts.avatar) {
                    $('<a>')
                        .attr('href', 'http://twitter.com/' + twitt.from_user.toLowerCase())
                        .append(
                            $('<img>')
                                .attr('src', twitt.profile_image_url)
                                .attr('width', 48)
                                .attr('height', 48)
                                .addClass('twittersearch-avatar')
                            )
                        .appendTo(li);
                }
                
                li.append(twitt.text);
                li.appendTo(list);
            });
        });
    }
    
})(jQuery);
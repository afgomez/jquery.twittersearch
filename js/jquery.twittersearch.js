
(function($) {
    
    /**
     * Performs a query to the Twitter search API and fills a jQuery object
     * with the results
     */
    $.fn.twitterSearch = function(query_string, options) {
        var opts = $.extend({}, $.fn.twitterSearch.defaults, options);
        
    };
    
    // Default settings
    $.fn.twitterSearch.defaults = {
    
    };
    
    
})(jQuery);
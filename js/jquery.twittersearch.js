/**
 * jQuery.twitterSearch Performs queries to the Twitter search API
 *
 * Copyright (c) 2009, Alejandro Fernández Gómez
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY Alejandro Fernández Gómez ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL Alejandro Fernández Gómez BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
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
        avatar_size: 'normal',
        template: '<li class="twitt"><a href="{author_url}"><img src="{avatar_url}" width="{avatar_size}" height="{avatar_size}" alt="{author_name}" /></a><p>{text}</p></li>',
        post_load_callback: undefined
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
                
                // Avatar
                switch(opts.avatar_size) {
                    case 'bigger':
                        var avatar_measures = 73;
                        break;
                    case 'mini': 
                        var avatar_measures = 24;
                        break;
                    case 'normal':
                        var avatar_measures = 48;
                        break;
                    default: // If users misspells it will default to normal
                        opts.avatar_size = 'normal';
                        var avatar_measures = 48;
                }
                if (opts.avatar_size != 'normal') {
                    twitt.profile_image_url = twitt.profile_image_url.replace(/normal\.(gif|jpg|png)$/, opts.avatar_size + ".$1");
                }
                
                // Parses the template
                var parsed_template = opts.template.replace(/{avatar_url}/g, twitt.profile_image_url)
                                        .replace(/{avatar_size}/g, avatar_measures)
                                        .replace(/{author_url}/g, 'http://twitter.com/' + twitt.from_user.toLowerCase())
                                        .replace(/{author_name}/g, twitt.from_user)
                                        .replace(/{text}/g, twitt.text);
                list.append(parsed_template);
            });
        });
        if (typeof(opts.post_load_callback) == 'function') {
            opts.post_load_callback.call(jObject);
        }
    }
    
})(jQuery);
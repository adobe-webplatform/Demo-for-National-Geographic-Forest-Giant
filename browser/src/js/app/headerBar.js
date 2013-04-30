/*global define $ TweenMax Quad Quint TimelineMax d3 Quart*/
/**
 *
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

define([], function (require) {

    var HeaderBar;
    
    HeaderBar = function () {

        var instance = this,
            searchExpanded = false,
            commentsExpanded = false;
        
        function handle_window_CLICK(evt) {
            var $target = $(evt.target);
            if( commentsExpanded ) {
                if( $target.is( '#comments-btn' ) ) {
                    return;
                } else if( !$target.parents('#item-list').length ) {
                    commentsExpanded = false;
                    $('body').removeClass( 'withSidebar' );
                    $('#item-list').transitionedClose();
                }
            }
        }
        
        function handle_comments_CLICK(evt) {
            evt.preventDefault();
            $('body').toggleClass( 'withSidebar' );
            if( commentsExpanded ) {
                $('#item-list').transitionedClose();
            } else {
                $('#item-list').transitionedOpen();
            }
            commentsExpanded = !commentsExpanded;
        }
        
        function handle_search_CLICK(evt) {
            evt.preventDefault();
            searchExpanded = !searchExpanded;
            $('#search-wrap').toggleClass( 'expanded', searchExpanded );
        }

        function init() {
            $('#search-btn')
                .click(handle_search_CLICK)
                .bind('touchstart', handle_search_CLICK);
                
            $('#search-wrap').bind('transitionend', function() {
                if( searchExpanded ) {
                    $('#search-wrap input').focus();
                }
            });
            
            $('#comments-btn')
                .click(handle_comments_CLICK)
                .bind('touchstart', handle_comments_CLICK);
                
            $(window).click(handle_window_CLICK);
            
            // For touch devices use .active class instead of hover
            $('header button').bind('touchstart', function() {
                $(this).addClass('active');
            }).bind('touchend', function() {
                $(this).removeClass('active');
            });
        }

        init();
    };

	return HeaderBar;
});

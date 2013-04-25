/*global define $ TweenMax Quad Quint TimelineMax d3 Quart*/
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

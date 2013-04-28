/*global define $ TweenMax Quad Quint TimelineMax iScroll*/
define([], function (require) {

    var ArticleCoverView;

    ArticleCoverView = function (id, img) {
        var instance = this,
            $el = $('<section class="view article-cover-view">'),
            //$scroll = $('<div id="article-pages-scroll-view-' + id + '" class="view article-pages-scroll-view">'),
            //$content = $('<div class="article-pages-content-view">'),
            pageScroll;

        //function handle_SCROLL(e) {
        //    e.preventDefault();
        //    e.stopPropagation();
        //}
        //
        //function addScroll() {
        //    pageScroll = new iScroll('article-pages-scroll-view-' + id, {
        //        momentum: true,
        //        hScrollbar: false,
        //        onScroll: handle_SCROLL
        //    });
        //}

        function addPages() {
            var i,
                x = 0,
                $pageThumb;

            for (i = 0; i < 20; i += 1) {
                $pageThumb = $('<div class="view page-thumb">');
                $pageThumb.css({'left': x});
                $content.append($pageThumb);
                
                x += 110;
            }

            $content.css('width', x + 'px');
            //pageScroll.refresh();
        }

        instance.init = function () {
            $el.css({'background-image': 'url(' + img + ')', 'background-size': window.innerWidth + 'px auto'});
        };

        instance.setPosition = function (x, y) {
            $el.css('left', x);
        };

        instance.draw = function () {
            
        };

        instance.show = function () {
            //if (id > 0) {
            //    addPages();
            //    addScroll();
            //}
        };

        instance.render = function () {
            //if (id > 0) {
                //$el.append($scroll);
                //$scroll.append($content);
            //} else {
                //cover
            //}
            return $el;
        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            $el.remove();
        };

        instance.init();
    };

	return ArticleCoverView;
});

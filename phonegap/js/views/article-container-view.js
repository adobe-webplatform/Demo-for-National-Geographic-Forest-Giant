/*global define $ TweenMax Quad Quint TimelineMax iScroll*/
define([], function (require) {

    var ArticleContainerView,
        ArticleCoverView = require('views/article-cover-view');

    require('iscroll');
    
    ArticleContainerView = function () {
        var instance = this,
            $el = $('<div id="article-container-view" class="view article-container-view">'),
            $scroll = $('<div id="article-scroll-view" class="view article-scroll-view">'),
            $content = $('<div id="article-content-view" class="article-content-view">'),
            dir = './assets/images/toc/',
            ARTICLES = [
                {img: 'cover.jpg'},
                {img: 'article1.jpg'},
                {img: 'article2.jpg'},
                {img: ''}
            ],
            scrollPosition = 0,
            articleScroll;
       
        function handle_SCROLL_END() {
            scrollPosition = Math.abs(Math.round(articleScroll.x / window.innerWidth));
        }

        function addScroll() {
            articleScroll = new iScroll('article-scroll-view', {
                snap: 'section',
                momentum: false,
                hScrollbar: false,
                onScrollEnd: handle_SCROLL_END
            });
        }

        function addArticles() {
            var i,
                article;

            for (i = 0; i < ARTICLES.length; i += 1) {
                article = new ArticleCoverView(i, dir + ARTICLES[i].img);
                article.setPosition((window.innerWidth * i), 0);
                $content.append(article.render());
                article.show();
            }

            $content.css('width', ((window.innerWidth * 10) + 100) + 'px');
            articleScroll.refresh();
        }

        

        instance.init = function () {

        };

        instance.draw = function () {
            
        };

        instance.show = function () {
            addScroll();
            addArticles();
        };

        instance.render = function () {
            $el.append($scroll);
            $scroll.append($content);
            return $el;
        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            $el.remove();
            articleScroll.destroy();
            articleScroll = null;
        };

        instance.init();
    };

	return ArticleContainerView;
});

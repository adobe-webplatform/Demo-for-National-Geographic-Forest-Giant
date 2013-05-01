/*global define $ TweenMax Quad Quint TimelineMax iScroll*/
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

        instance.animIn = function (callback) {

        };

        instance.animOut = function (callback) {
            
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

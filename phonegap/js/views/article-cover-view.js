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

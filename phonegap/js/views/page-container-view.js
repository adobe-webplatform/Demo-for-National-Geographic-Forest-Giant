/*global define $ TweenMax Quad Quint TimelineMax iScroll Hyphenator*/
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

    var PageContainerView,
        PageView = require('views/page-view'),
        TransformElement = require('views/components/transform-element'),
        //FilterElement = require('views/components/filter-element'),
        FilterElement = require('views/components/max-filter-element'),
        MapElement = require('views/components/map-element'),
        AppEvent = require('events/app-event');

    require('iscroll');
    
    PageContainerView = function (pageObj) {
        var instance = this,
            $el = $('<div class="page-container-view">'),
            $scroll = $('<div id="page-scroll-view" class="view page-scroll-view">'),
            $content = $('<div id="page-content-view" class="page-content-view">'),
            $copy = $('<div id="content1">'),
            $shadows = $('<div class="page-container-shadows">'),
            $pageSections,
            $topBar = $('<div class="bar top">'),
            $bottomBar = $('<div class="bar bottom">'),
            PAGES = pageObj.list,
            scrollPosition = 0,
            pageScroll,
            animatables = [],
            deltaDistance,
            mapElement;

        function getDistance(p1, p2) {
            var distance,
                dx, dy;

            dx = p1.x - p2.x;
            dy = p1.y - p2.y;
            distance = Math.sqrt(dx * dx + dy * dy);

            return distance;
        }
        
        function updatePageVisibility(currentIndex) {
            var hiddenClass = 'hidden-page';
            for( var i = 0; i < $pageSections.length; i++ ) {
                if( currentIndex >= i - 2 && currentIndex <= i + 2 ) {
                    $pageSections[i].classList.remove(hiddenClass);
                } else {
                    $pageSections[i].classList.add(hiddenClass);
                }
            }
        }

        function handle_SCROLL_MOVE() {

        }

        function handle_SCROLL_START(e) {
            if (mapElement && e.target != 'curl-spot') {
                mapElement.destroy();
            }
        }

        function handle_SCROLL_END() {
            var $currentSection,
                fullscreenElement,
                i;

            for (i = 0; i < animatables.length; i += 1) {
                animatables[i].destroy();
            }

            //scrollPosition = Math.abs(Math.floor(pageScroll.x / window.innerWidth));
            scrollPosition = pageScroll.currPageX;
            $currentSection = $($pageSections[scrollPosition]);
            updatePageVisibility(scrollPosition);

            if ($currentSection.find('.js-filter-element').length == 1) {
                fullscreenElement = new FilterElement($currentSection.find('.js-filter-element'), pageScroll);
                animatables.push(fullscreenElement);
            } else if ($currentSection.find('.js-transform-element').length == 1) {
                fullscreenElement = new TransformElement($currentSection.find('.js-transform-element'), pageScroll);
                animatables.push(fullscreenElement);
            }
            
            if ($currentSection.find('.map-content').length == 1) {
                if (!mapElement) {
                    mapElement = new MapElement($currentSection, pageScroll);
                }
                mapElement.prepareMaps();
            }
        }

        function addScroll() {
            pageScroll = new iScroll('page-scroll-view', {
                snap: 'section.page-view',
                momentum: false,
                hScrollbar: false,
                vScrollbar: false,
                onScrollMove: handle_SCROLL_MOVE,
                onScrollEnd: handle_SCROLL_END,
                onScrollStart: handle_SCROLL_START,
                transformChildren: false
            });

            $('#page-scroll-view').css('overflow', 'visible');
        }

        function addPages() {
            var i,
                page,
                width = 0;

            for (i = 0; i < PAGES.length; i += 1) {
                page = new PageView(PAGES[i]);

                if (i === 0) {
                    TweenMax.set(page.render(), {css: {className: '+=in'}});
                }

                $content.append(page.render());
                page.show();
                var left = page.render().position().left;
                width = page.render().position().left + page.render().width();
                // console.log('left', left);
            }

            $copy.html(pageObj.content);
            $('body').append($copy);

            $content.css('width', ((window.innerWidth * PAGES.length) + 100) + 'px');
            // $content.css('width', window.innerWidth);
            $pageSections = $('.page-view');
        }

        function handle_TOUCHSTART(e) {
            var touches = e.originalEvent.touches,
                t1, t2;
                
            if (e.target.id == 'curl-spot' && mapElement) {
                e.preventDefault();
                mapElement.showMap();
                mapElement.handleTouchStart(e);
                return;
            }
        }

        function handle_TOUCHMOVE(e) {
            var touches = e.originalEvent.touches;
               
            if (touches.length == 3) {
                AppEvent.GOTO_VIEW.dispatch(1);
            }
        };

        instance.init = function () {
            $el.css({
                webkitTransform: 'none',
                opacity: '1'
            });
        };

        instance.update = function () {

        };

        instance.show = function () {
            addPages();
            addScroll();
            pageScroll.refresh();
            //parseButtons();
            //Hyphenator.run();  //performance hit
            $('.balance').balanceText();
            pageScroll.scrollToPage(0, 0, 0);
        };

        instance.render = function () {
            $el.append($scroll);
            $el.append($shadows);
            $scroll.append($content);

            $content.append($topBar);
            $content.append($bottomBar);

            $el.bind('touchstart', handle_TOUCHSTART);
            $el.bind('touchmove', handle_TOUCHMOVE);
            
            return $el;
        };

        instance.animIn = function (callback) {
            
        };

        instance.animOut = function (callback) {
            var btn = $('.toc-view-button')[1];
                
            $el.unbind('touchstart');
            $el.unbind('touchmove');

            new TweenMax.to($el, 1, {
                css: {
                    scale: 0.5, 
                    x: $(btn).offset().left - ($(btn).width() * 0.6), 
                    y: $(btn).offset().top - ($(btn).height() * 0.6), 
                    z: 0.01,
                    opacity: 0
                }, 
                onComplete: function () {
                    callback(); 
                }
            });
        };

        instance.destroy = function () {
            pageScroll.destroy();
            
            $scroll.empty();
            $content.empty();
            $el.empty();
            $el.remove();
        }
    };

	return PageContainerView;
});

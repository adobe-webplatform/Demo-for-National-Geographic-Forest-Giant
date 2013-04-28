/*global define $ TweenMax Quad Quint TimelineMax iScroll Hyphenator*/
define([], function (require) {

    var PageContainerView,
        PageView = require('views/page-view'),
        TransformElement = require('views/components/transform-element'),
        FilterElement = require('views/components/filter-element'),
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

        function handle_SCROLL_MOVE() {

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
            $currentSection = $($('.page-view')[scrollPosition]);

            if ($currentSection.find('.js-filter-element').length == 1) {
                fullscreenElement = new FilterElement($currentSection.find('.js-filter-element'), pageScroll);
                animatables.push(fullscreenElement);
            } else if ($currentSection.find('.js-transform-element').length == 1) {
                fullscreenElement = new TransformElement($currentSection.find('.js-transform-element'), pageScroll);
                animatables.push(fullscreenElement);
            }
            
            if( $currentSection.find('.map-content').length == 1 ) {
                if( !mapElement ) {
                    mapElement = new MapElement($currentSection);
                }
            } else {
                if(mapElement) {
                    mapElement.destroy();
                }
            }
        }

        function addScroll() {
            pageScroll = new iScroll('page-scroll-view', {
                snap: 'section.page-view',
                momentum: false,
                hScrollbar: false,
                vScrollbar: false,
                onScrollMove: handle_SCROLL_MOVE,
                onScrollEnd: handle_SCROLL_END
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
                width = page.render().position().left + page.render().width();
            }

            $copy.html(pageObj.content);
            $('body').append($copy);

            $content.css('width', ((window.innerWidth * PAGES.length) + 100) + 'px');
            pageScroll.refresh();
        }

        function parseButtons() {
            var transformElement,
                filterElement;

            /*
            $('.js-transform-element').each(function () {
                transformElement = new TransformElement(this);
                //animatables.push(transformElement);
            });

            $('.js-filter-element').each(function () {
                filterElement = new FilterElement(this, pageScroll);
                //animatables.push(filterElement);
            });
            */
        }

        function handle_TOUCHSTART(e) {
            var touches = e.originalEvent.touches,
                t1, t2;
                
            if(e.target.id == 'curl-spot') {
                e.preventDefault();
                mapElement.showMaps();
                mapElement.handleTouchStart(e);
                return;
            }
                
            if (touches.length == 2) {
                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};

                deltaDistance = getDistance(t1, t2);
            } else {
                deltaDistance = null;
            }
        }

        function handle_TOUCHMOVE(e) {
            var touches = e.originalEvent.touches,
                t1, t2,
                dist;

            if (touches.length == 2 && deltaDistance) {

                e.preventDefault();
                e.stopPropagation();

                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};
 
                dist = getDistance(t1, t2);

                if (dist - deltaDistance < -100) {
                    AppEvent.GOTO_VIEW.dispatch(1);
                }
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
            addScroll();
            addPages();
            parseButtons();
            //Hyphenator.run();  //performance hit
            $('.balance').balanceText();
            pageScroll.scrollToPage(0, 0, 0);
        };

        instance.render = function () {
            $el.append($scroll);
            $el.append($shadows);
            $scroll.append($content);

            $el.bind('touchstart', handle_TOUCHSTART);
            $el.bind('touchmove', handle_TOUCHMOVE);
            //$('body').bind('keydown', function (e) {
            //    AppEvent.GOTO_VIEW.dispatch(1);
            //});
            
            return $el;
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

/*global define $ TweenMax Quad Quint TimelineMax iScroll Linear*/

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

    var FilterElement;

    FilterElement = function (element, scroll) {
        var instance = this,
            $el = $(element),
            $body,
            $container,
            $filterEl,
            $resolveEl,
            filterPath = 'assets/shaders/',
            opening = false,
            rotateTimeline,
            openTimeline,
            timeline,
            filter,
            animating = false,
            dragging = false,
            deltaMidpoint = {x: 0, y: 0},
            deltaDistance = 0,
            deltaAngle = 0,
            deltaRotation = 0,
            SCALE_DIVIDER = 100,
            basefilter = {
                vert: filterPath + 'page-fold.vs',
                frag: filterPath + 'page-fold.fs',
                x: $el.data('filter-x'),
                y: $el.data('filter-y'),
                scale: 0.93,
                rotateY: -90,
                rotateX: 0,
                rotateZ: 0,
                fold: 1.55
            };

        function getAngle(p1, p2) {
            var angle,
                dx, dy;
            
            dx = p1.x - p2.x;
            dy = p1.y - p2.y;
            angle = Math.atan2(dy, dx) * 180 / Math.PI;

            return angle;
        }

        function getMidpoint(p1, p2) {
            var midpoint = {};

            midpoint.x = (p1.x + p2.x) / 2;
            midpoint.y = (p1.y + p2.y) / 2;

            return midpoint;
        }

        function getDistance(p1, p2) {
            var distance,
                dx, dy;

            dx = p1.x - p2.x;
            dy = p1.y - p2.y;
            distance = Math.sqrt(dx * dx + dy * dy);

            return distance;
        }

        function resetFilter() {
            filter = {
                vert: filterPath + 'page-fold.vs',
                frag: filterPath + 'page-fold.fs',
                x: basefilter.x,
                y: basefilter.y,
                scale: basefilter.scale,
                rotateY: basefilter.rotateY,
                rotateX: basefilter.rotateX,
                rotateZ: basefilter.rotateZ,
                fold: basefilter.fold
            };
        }

        function updateFilter() {
            $filterEl.css({
                'webkitFilter': 
                    'custom(url(' + filter.vert + ') ' + 
                    'mix(url(' + filter.frag + ') ' + 
                    'multiply source-atop), ' + 
                    '6 6 border-box, ' + 
                    'transform perspective(5000) ' + 
                    'scale(' + filter.scale + ') ' + 
                    'translateX(' + filter.x + 'px) ' + 
                    'translateY(' + filter.y + 'px) ' + 
                    'rotateX(' + filter.rotateX + 'deg) ' + 
                    'rotateY(' + filter.rotateY + 'deg) ' + 
                    'rotateZ(' + filter.rotateZ + 'deg), ' + 
                    't 0, fold ' + filter.fold + ', ' + 
                    'shadow 2.0, ' + 
                    'mapDepth 40, ' + 
                    'mapCurve 0, ' + 
                    'minSpacing 1, ' + 
                    'useColoredBack 1, ' + 
                    'backColor 0.5 0.5 0.5 1)'
            });
        }

        function addContainer() {
            $container = $('<div>');
            $container.addClass('transition-container');
            $body.append($container);
        }

        function addTimeline() {
            timeline = new TimelineMax();
            timeline.insert(new TweenMax(filter, 1, {rotateY: 0, ease: Quint.easeOut}));
            timeline.insert(new TweenMax(filter, 2, {fold: 1.4, ease: Quint.easeOut}));
            timeline.insert(new TweenMax(filter, 2, {fold: 0, ease: Linear.easeNone, delay: 2}));
            timeline.insert(new TweenMax(filter, 4, {scale: 1, ease: Linear.easeNone}));
            timeline.pause();
            //timeline.timeScale(4);
        }

        function addFilterElement() {

            console.log('add filter element');
            $filterEl = $('<div>');
            $filterEl.addClass('transition-filter');
            $filterEl.css({
                'background-image': $el.css('background-image'), 
                'opacity': '0'
            });
            updateFilter();
            $container.append($filterEl);

            $resolveEl = $filterEl.clone();
            $resolveEl.css({'webkitFilter': 'none', 'opacity': '0'});
            $container.append($resolveEl);
        }

        function showFilterElement() {
            console.log('show filter element');
            $el.css({opacity: 0});
            $filterEl.css({opacity: 1});
        }

        function openResolve() {
            console.log('open resolve');
            
            dragging = false;

            $container.css({'pointer-events': 'auto'});
            $resolveEl.css({opacity: 1, 'pointer-events': 'auto'});
            $resolveEl.bind('touchstart', handle_resolveEl_TOUCHSTART);
            $resolveEl.bind('click', handle_resolveEl_CLICK);

            $filterEl.css({opacity: 0});
        }

        function closeResolve() {
            console.log('close resolve');

            dragging = false;
            $container.css({'pointer-events': 'none'});
            $filterEl.css({opacity: 0});
            $el.css({opacity: 1});
            scroll.enable();
        }

        function handle_filter_TOUCHEND(e) {

            console.log('filter: touch end');
            
            e.preventDefault();
            e.stopPropagation();

            $body.unbind('touchend');
            $body.unbind('touchmove');

            if (opening) {
                new TweenMax.to(filter, 0.5, {
                    x: 0, 
                    y: 0, 
                    fold: 0, 
                    rotateY: 0, 
                    rotateZ: 0, 
                    scale: 1, 
                    onComplete: openResolve
                });
            } else {
                new TweenMax.to(filter, 0.5, {
                    x: basefilter.x, 
                    y: basefilter.y, 
                    fold: basefilter.fold, 
                    rotateY: basefilter.rotateY, 
                    rotateZ: basefilter.rotateZ, 
                    scale: basefilter.scale, 
                    onComplete: closeResolve
                });
            }
        }

        function handle_filter_TOUCHMOVE(e) {
            var touches = e.originalEvent.touches,
                t1, t2,
                newAngle,
                newMidpoint,
                newDistance,
                distance,
                distanceDifference,
                timelinePosition;

            e.preventDefault();
            e.stopPropagation();

            if (touches.length == 2) {

                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};

                newDistance = getDistance(t1, t2);
                distanceDifference = newDistance - deltaDistance;
                distanceDifference = distanceDifference > 0 ? distanceDifference : 0;

                //get timline position
                timelinePosition = newDistance / 100;
                timelinePosition = timelinePosition > 2 ? timelinePosition : 2;
                opening = timelinePosition > 3 ? true : false;

                //calculate transform
                newMidpoint = getMidpoint(t1, t2);
                filter.x = (newMidpoint.x - deltaMidpoint.x) / filter.scale;
                filter.y = (newMidpoint.y - deltaMidpoint.y) / filter.scale;

                distance = getDistance(deltaMidpoint, newMidpoint);
                opening = distance > 100 ? true : opening;

                console.log('filter: touch move', timelinePosition);

                timeline.seek(timelinePosition);
            }
        }

        function calculateMidpoint(t1, t2) {
            deltaMidpoint = getMidpoint(t1, t2);
            deltaDistance = getDistance(t1, t2);
            deltaMidpoint = {x: deltaMidpoint.x - filter.x, y: deltaMidpoint.y - filter.y};
        }

        function handle_el_TOUCHSTART(e) {
            var touches = e.originalEvent.touches,
                t1, t2;

            if (touches.length == 2) {

                console.log('el touchstart');

                e.preventDefault();
                e.stopPropagation();
                
                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};

                dragging = true;
                animating = true;

                resetFilter();
                showFilterElement();
                calculateMidpoint(t1, t2);
                addTimeline();
                
                instance.startRequestAnimationFrame();
                scroll.disable();

                $body.bind('touchend', handle_filter_TOUCHEND);
                $body.bind('touchmove', handle_filter_TOUCHMOVE);

                timeline.tweenTo(2, {onComplete: function () {
                    animating = false;
                }});
            }
        }

        function handle_resolveEl_TOUCHSTART(e) {
            var touches = e.originalEvent.touches,
                t1, t2;
    
            //e.preventDefault();
            e.stopPropagation();

            if (touches.length == 2) {

                console.log('resolve touchstart');
                
                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};

                dragging = true;
                animating = false;

                $resolveEl.css({opacity: 0, 'pointer-events': 'none'});
                $filterEl.css({'opacity': 1});
                
                calculateMidpoint(t1, t2);
                instance.startRequestAnimationFrame();

                $body.bind('touchend', handle_filter_TOUCHEND);
                $body.bind('touchmove', handle_filter_TOUCHMOVE);
            
                $resolveEl.unbind('touchstart');
            }
        }

        function handle_resolveEl_CLICK(e) {
            
            console.log('resolve click');

            dragging = true;
            animating = true;
                
            $resolveEl.css({opacity: 0, 'pointer-events': 'none'});
            $filterEl.css({'opacity': 1});

            //TweenMax.killTweensOf(filter); //KILL
            
            timeline.reverse();
            new TweenMax.to(filter, 2, {x: basefilter.x, y: basefilter.y, onComplete: closeResolve});
            instance.startRequestAnimationFrame();
        }

        function handle_el_CLICK(e) {
            
            console.log('el click');

            dragging = true;
            animating = true;

            resetFilter();
            showFilterElement();

            //TweenMax.killTweensOf(filter); //KILL

            addTimeline();
            timeline.play();
            
            new TweenMax.to(filter, 2, {x: 0, y: 0, onComplete: openResolve});
            scroll.disable();
            instance.startRequestAnimationFrame();
        }

        instance.init = function () {
            $body = $('body');
            $el.bind('touchstart', handle_el_TOUCHSTART);
            $el.bind('click', handle_el_CLICK);
            addContainer();
            resetFilter();
            addFilterElement();
            instance.waitingRequestAnimationFrame = false;
        };

        instance.startRequestAnimationFrame = function () {
            if (instance.waitingRequestAnimationFrame) 
                return;
            instance.waitingRequestAnimationFrame = true;
            requestAnimationFrame(instance.draw);
        };

        instance.draw = function () {
            instance.waitingRequestAnimationFrame = false;
            if (!dragging)
                return;
            updateFilter();
            instance.startRequestAnimationFrame();
        };

        instance.render = function () {

        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            dragging = false;
            animating = false;
            $container.empty();
            $container.remove();
        };

        instance.init();
    };

	return FilterElement;
});

 

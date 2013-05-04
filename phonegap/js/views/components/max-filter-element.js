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
            timeline,
            foldtimeline,
            linearFoldTimeline,
            rotateTween,
            unfoldTween,
            closeTween,
            openTween,
            filter = {},
            animating = false,
            dragging = false,
            deltaMidpoint = {x: 0, y: 0},
            deltaAngle = 0,
            deltaRotation = 0,
            foldLevel = 0, // 0 = folded in half, 1 = unfolded
            SCALE_DIVIDER = 100,
            basefilter = {
                ambient: 1,
                vert: filterPath + 'max-fold.vs',
                frag: filterPath + 'max-fold.fs',
                x: $el.data('filter-x'),
                y: $el.data('filter-y'),
                z: 0,
                scale: 0.93,//0.93,
                rotateY: -90,
                rotateX: 0,
                rotateZ: 0,
                a9: -89,
                a10: 90
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
            for (var i in basefilter) {
                filter[i] = basefilter[i];
            }
        }

        function updateFilter() {
            var str = 'custom(url(' + filter.vert + ') mix(url(' + filter.frag + ') multiply source-atop), 20 8 border-box, ' + 
                    'ambientLight ' + filter.ambient + ', ' + 
                    'perspective 5000, ' + 
                    'translation ' + filter.x + ' ' + filter.y + ' 0, ' + 
                    'rotation ' + filter.rotateX + ' ' + filter.rotateY + ' ' + filter.rotateZ + ', ' + 
                    'scale ' + filter.scale + ', ' + 
                    'lightPosition 0 0 1, ' + 
                    'anchorIndex 10, ' + 
                    'a0 ' + filter.a0 + ', ' + 
                    'a1 ' + filter.a1 + ', ' + 
                    'a2 ' + filter.a2 + ', ' + 
                    'a3 ' + filter.a3 + ', ' + 
                    'a4 ' + filter.a4 + ', ' + 
                    'a5 ' + filter.a5 + ', ' + 
                    'a6 ' + filter.a6 + ', ' + 
                    'a7 ' + filter.a7 + ', ' + 
                    'a8 ' + filter.a8 + ', ' + 
                    'a9 ' + filter.a9 + ', ' + 
                    'a10 ' + filter.a10 + ', ' + 
                    'a11 ' + filter.a11 + ', ' + 
                    'a12 ' + filter.a12 + ', ' + 
                    'a13 ' + filter.a13 + ', ' + 
                    'a14 ' + filter.a14 + ', ' + 
                    'a15 ' + filter.a15 + ', ' + 
                    'a16 ' + filter.a16 + ', ' + 
                    'a17 ' + filter.a17 + ', ' + 
                    'a18 ' + filter.a18 + ', ' + 
                    'a19 ' + filter.a19 + ')';
            $filterEl.css({
                'webkitFilter': str
            });
            console.log(str);
        }
        
        window.updateFilter = updateFilter; // debug

        function addContainer() {
            $container = $('<div>');
            $container.addClass('transition-container');
            $body.append($container);
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
            
        function rotateResolve() {
        
        }    
        
        function openResolve() {

            dragging = false;
            console.log('filter', filter);
            updateFilter(); // Needed for last frame
            
            return; //debug

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
        
        function makeTweens() {
            var dragFoldFilter = {};
            
            linearFoldTimeline = new TimelineMax();
            
            linearFoldTimeline.insert( new TweenMax.to(filter, 1, {
                a9: 0,
                a10: 0,
                ease: Linear.easeNone,
                onComplete: openResolve
            }) );
            linearFoldTimeline.pause();
            
            rotateTween = new TweenMax.to(filter, 1, {
                rotateY: 0,
                ease: Linear.easeNone,
                onComplete: rotateResolve
            });
            rotateTween.timeScale(2);
            rotateTween.pause();
        }
        
        function handle_filter_TOUCHEND(e) {

            console.log('filter: touch end');
            
            e.preventDefault();
            e.stopPropagation();

            $body.unbind('touchend');
            $body.unbind('touchmove');


        }

        function handle_filter_TOUCHMOVE(e) {
            var touches = e.originalEvent.touches,
                t1, t2;

            e.preventDefault();
            e.stopPropagation();

            if (touches.length == 2) {

                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};
            }
        }
        
        function getTranslate(t1, t2) {
            var newMidpoint = getMidpoint(t1, t2);
            return {
                x: newMidpoint.x / window.innerWidth - 0.5,
                y: newMidpoint.y / window.innerHeight - 0.5
            };
        }
        
        function calculateMidpoint(t1, t2) {
            deltaMidpoint = getMidpoint(t1, t2);
            // deltaDistance = getDistance(t1, t2);
            // deltaMidpoint = {x: deltaMidpoint.x - filter.x, y: deltaMidpoint.y - filter.y};
        }

        function handle_el_TOUCHSTART(e) {
            var touches = e.originalEvent.touches,
                t1, t2,
                distance;

            if (touches.length == 2) {

                console.log('el touchstart');

                e.preventDefault();
                e.stopPropagation();
                scroll.disable();
                
                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};
                distance = getDistance(t1, t2);
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
            }
        }

        function handle_resolveEl_CLICK(e) {
            console.log('resolve click');

        }

        function handle_el_CLICK(e) {
            console.log('el click');
            scroll.disable();
            
            dragging = true;
            animating = true;
            showFilterElement();
            
            instance.startRequestAnimationFrame();
            linearFoldTimeline.seek(0);
            linearFoldTimeline.play();
            rotateTween.play();
        }

        instance.init = function () {
            var i;
            
            console.log('init');
            $body = $('body');

            $el.bind('touchstart', handle_el_TOUCHSTART);
            $el.bind('click', handle_el_CLICK);
            
            for (i = 0; i < 20; i += 1) {
                if( i == 9 || i == 10 ) {
                    continue;
                } 
                basefilter['a' + i] = 0;
            }
            resetFilter();
            
            makeTweens();

            addContainer();
            

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

 

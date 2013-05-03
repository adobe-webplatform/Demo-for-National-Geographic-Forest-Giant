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
            unfoldTween,
            closeTween,
            openTween,
            filter = {},
            animating = false,
            dragging = false,
            deltaMidpoint = {x: 0, y: 0},
            deltaDistance = 0,
            deltaAngle = 0,
            deltaRotation = 0,
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
                rotateZ: 0
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
            $filterEl.css({
                'webkitFilter': 
                    'custom(url(' + filter.vert + ') mix(url(' + filter.frag + ') multiply source-atop), 20 8 border-box, ' + 
                    'ambientLight ' + filter.ambient + ', ' + 
                    'perspective 5000, ' + 
                    'translation ' + filter.x + ' ' + filter.y + ' 0, ' + 
                    'rotation ' + filter.rotateX + ' ' + filter.rotateY + ' ' + filter.rotateZ + ', ' + 
                    'scale ' + filter.scale + ', ' + 
                    'lightPosition 0 0 1, ' + 
                    'anchorIndex 10, ' + 
                    'a0 ' + filter.a[0].value + ', ' + 
                    'a1 ' + filter.a[1].value + ', ' + 
                    'a2 ' + filter.a[2].value + ', ' + 
                    'a3 ' + filter.a[3].value + ', ' + 
                    'a4 ' + filter.a[4].value + ', ' + 
                    'a5 ' + filter.a[5].value + ', ' + 
                    'a6 ' + filter.a[6].value + ', ' + 
                    'a7 ' + filter.a[7].value + ', ' + 
                    'a8 ' + filter.a[8].value + ', ' + 
                    'a9 ' + filter.a[9].value + ', ' + 
                    'a10 ' + filter.a[10].value + ', ' + 
                    'a11 ' + filter.a[11].value + ', ' + 
                    'a12 ' + filter.a[12].value + ', ' + 
                    'a13 ' + filter.a[13].value + ', ' + 
                    'a14 ' + filter.a[14].value + ', ' + 
                    'a15 ' + filter.a[15].value + ', ' + 
                    'a16 ' + filter.a[16].value + ', ' + 
                    'a17 ' + filter.a[17].value + ', ' + 
                    'a18 ' + filter.a[18].value + ', ' + 
                    'a19 ' + filter.a[19].value + ')'
            });
        }

        function addContainer() {
            $container = $('<div>');
            $container.addClass('transition-container');
            $body.append($container);
        }

        function addTimeline() {
            var i,
                key,
                time,
                delay;

            //fold
            foldtimeline = new TimelineMax();
            foldtimeline.insert(new TweenMax.to(filter.a[9], 1, {value: -70}));
            foldtimeline.insert(new TweenMax.to(filter.a[10], 1, {value: 70}));
            
            foldtimeline.insert(new TweenMax.to(filter.a[9], 2, {value: 0, delay: 1}));
            foldtimeline.insert(new TweenMax.to(filter.a[10], 2, {value: 0, delay: 1}));

            for (i = 0; i < 20; i += 1) {
                if (i < 9) {
                    foldtimeline.insert(new TweenMax.fromTo(filter.a[i], 1, {value: 0}, {value: 9 - i}));
                    foldtimeline.insert(new TweenMax.to(filter.a[i], 2, {value: 0, delay: 1}));
                } else if (i > 10) {
                    foldtimeline.insert(new TweenMax.fromTo(filter.a[i], 1, {value: 0}, {value: 10 - i}));
                    foldtimeline.insert(new TweenMax.to(filter.a[i], 2, {value: 0, delay: 1}));
                }
            }

            //rotation
            timeline = new TimelineMax();
            timeline.insert(foldtimeline);
            timeline.insert(new TweenMax.to(filter, 1, {rotateY: 0, ambient: 0.3, ease: Quint.easeOut}));

            //timeline.insert(new TweenMax(filter, 2, {scale: 1, ease: Linear.easeNone}));
            timeline.pause();
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

            timeline.pause();

            if (opening) {
                timeline.tweenTo(3, {onComplete: openResolve});
                openTween = new TweenMax.to(filter, 0.5, {
                    x: 0, 
                    y: 0, 
                    scale: 1
                });
            } else {
                timeline.tweenTo(0, {onComplete: closeResolve});
                closeTween = new TweenMax.to(filter, 0.5, {
                    x: basefilter.x, 
                    y: basefilter.y, 
                    scale: basefilter.scale
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
                timelinePosition = timelinePosition > 1 ? timelinePosition : 1;
                opening = timelinePosition > 2 ? true : false;

                //calculate transform
                newMidpoint = getMidpoint(t1, t2);
                filter.x = (newMidpoint.x - deltaMidpoint.x) / 1000; // / filter.scale;
                filter.y = (newMidpoint.y - deltaMidpoint.y) / 1000; // / filter.scale;

                distance = getDistance(deltaMidpoint, newMidpoint);
                opening = distance > 100 ? true : opening;

                console.log('filter: touch move');

                unfoldTween.kill();
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

                unfoldTween = timeline.tweenTo(1);
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

                timeline.seek(3);

                updateFilter();
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

            timeline.timeScale(2);
            timeline.reverse();
            new TweenMax.to(filter, 2, {x: basefilter.x, y: basefilter.y, scale: basefilter.scale, onComplete: closeResolve});
            instance.startRequestAnimationFrame();
        }

        function handle_el_CLICK(e) {
            
            console.log('el click');

            dragging = true;
            animating = true;

            resetFilter();
            showFilterElement();

            addTimeline();
            timeline.seek(0);
            //timeline.timeScale(2);
            timeline.play();
            new TweenMax.to(filter, 2, {x: 0, y: 0, scale: 1, onComplete: openResolve});

            scroll.disable();

            instance.startRequestAnimationFrame();
        }

        instance.init = function () {
            var i;

            $body = $('body');
            $el.bind('touchstart', handle_el_TOUCHSTART);
            $el.bind('click', handle_el_CLICK);

            basefilter.a = [];
            for (i = 0; i < 20; i += 1) {
                basefilter.a.push({value: 0});
            }
            basefilter.a[9].value = -89;
            basefilter.a[10].value = 90;

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

 

/*global define $ TweenMax Quad Quint TimelineMax iScroll google*/
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

    var MapElement;

    MapElement = function ($section, pageScroll) {
        var instance = this,
            $container,
            $mapPage,
            googleMap,
            viewportAngle = 135,
            startX = 0,
            overlaysCreated = false,
            filter = null,
            allowDrawing = false,
            BIG_CURL = 0.2,
            SMALL_CURL = 0.04

        function resetFilter() {
            filter = {
                curlDirection: viewportAngle,
                curlRadius: BIG_CURL,
                curlX: 0.5,
                curlY: 0.5
            };
        }
        
        // Math.atan(x) * (180/Math.PI)
        
        // 1 = no curl
        // -1 = page all gone
        function updateFilter() {
            $mapPage.css('webkitFilter',
            'custom(url(assets/shaders/page-curl.vs) mix(url(assets/shaders/page-curl.fs) normal source-atop), 50 50 border-box, transform perspective(1000) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg), '
            + 'curlPosition ' + filter.curlX + ' ' + filter.curlY + ', curlDirection ' + filter.curlDirection + ', curlRadius ' + filter.curlRadius + ', bleedThrough 0.5)');
        }

        function openResolve() {
            instance.showMap();
            $mapPage.css('transform', 'translateX(-' + window.innerWidth + 'px)');
            allowDrawing = false;
            pageScroll.disable();
        }
        
        function closeResolve() {
            allowDrawing = false;
            instance.hideMap();
            pageScroll.enable();
        }
        
        function handle_TOUCHSTART(e) {
            startX = e.originalEvent.touches[0].pageX;
            $('#curl-spot').bind('touchmove.map', handle_TOUCHMOVE);
            $('#curl-spot').bind('touchend.map', handle_TOUCHEND);
            resetFilter();
            allowDrawing = true;
            instance.draw();
        }
        
        function handle_TOUCHMOVE(e) {
            var pageX = e.originalEvent.touches[0].pageX;
            var pageY = e.originalEvent.touches[0].pageY;
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
            var posX = pageX / window.innerWidth;
            var posY = pageY / window.innerHeight;
            // var diff = Math.abs( posX - posY );
            var n = 0.45;
            var x = (posX * n * 2.2) - n - 0.2; // 1 = 1, 0 = -1
            var y = (posY * n * 2.2) - n - 0.2;
            filter.curlX = x; // x = 1 => x = 0.7
            filter.curlY = y;

            filter.curlDirection = Math.atan(pageY / pageX) * (180/Math.PI) + 90;
        }
        
        function handle_TOUCHEND(e) {
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
            
            var endX = e.originalEvent.changedTouches[0].pageX;
            
            // Close if still in righter 2/3rds
            if( endX > window.innerWidth * (2/3) ) {
                // Return to normal
                $('#curl-spot').unbind('touchmove.map').unbind('touchend.map');
                closeMap();
            } else {
                // Show gmap
                TweenMax.to(filter, 0.5, {
                    curlX: -0.6,
                    curlY: -0.6,
                    curlDirection: viewportAngle,
                    onComplete: openResolve
                });
            }
            
            console.log('touchend');
        }
        
        function closeMap() {
            var timeline = new TimelineMax();
            timeline.add(new TweenMax(filter, 1.5, {
                curlX: 0.5,
                curlY: 0.5,
                curlDirection: viewportAngle,
                curlRadius: BIG_CURL
            }));
            timeline.add(new TweenMax(filter, 1, {
                curlX: 0.42,
                curlY: 0.42,
                curlDirection: 111,
                curlRadius: SMALL_CURL,
                onComplete: closeResolve
            }));
            timeline.play();
        }
        
        function addBackButton() {

            var button = $('<button id="map-back-button"></button>')[0];
            
            googleMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(button);
            google.maps.event.addDomListener(button, 'click', function() {
                $mapPage.css('transform', 'none');
                setTimeout(function() {
                    allowDrawing = true;
                    filter = {
                      curlX: -0.6,
                      curlY: -0.6,
                      curlDirection: 135,
                      curlRadius: BIG_CURL
                    };
                    instance.draw();
                    closeMap();
                }, 1000);
            });
        }
        
        function initGoogleMap() {
            if( !window.google ) {
                
                return;
            }
            var mapOptions = {
                center: new google.maps.LatLng(36.4333, -118.6833),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_CENTER
                }
            };
            
            googleMap = new google.maps.Map($container[0], mapOptions);
            addBackButton();
        }
        
                
        function createOverlays() {
            // Set our map
            $mapPage = $section.find('.map-content');
            
            // Create the google map container
            $container = $('<div id="map-canvas">').insertAfter($mapPage);
        }
        
        instance.handleTouchStart = handle_TOUCHSTART;
        
        instance.prepareMaps = function() {
            instance.hideMap();
        }
        
        instance.showMap = function() {
            // $container.css('z-index', 1);
            $container.css('visibility', 'visible');
            // $container.show();
        }

        instance.hideMap = function() {
            // $container.css('z-index', -1);
            $container.css('visibility', 'hidden');
            // $container.hide();
        }

        instance.init = function () {
            // viewportAngle = Math.atan(window.innerWidth / window.innerHeight) * (180/Math.PI) + 90;
            createOverlays();
            resetFilter();
            initGoogleMap();
            instance.hideMap();
            
            updateFilter();
            setTimeout(function() {
                allowDrawing = true;
                instance.draw();
                TweenMax.to(filter, 0.5, {
                    curlX: 0.42,
                    curlY: 0.42,
                    curlDirection: 111,
                    curlRadius: SMALL_CURL,
                    onComplete: function() { allowDrawing = false; }
                });
            }, 1500);
        };

        instance.draw = function () {
            if (allowDrawing) {
                updateFilter();
                requestAnimationFrame(instance.draw);
            }
        };

        instance.render = function () {

        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {

        };

      
        instance.init();
    };

	return MapElement;
});


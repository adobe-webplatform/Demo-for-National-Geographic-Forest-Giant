/*global define $ TweenMax Quad Quint TimelineMax iScroll google*/
define([], function (require) {

    var MapElement;

    MapElement = function ($section) {
        var instance = this,
            $body,
            $container,
            $mapCopy,
            googleMap,
            startX = 0,
            overlaysCreated = false,
            filter = null,
            dragging = false;

        function addOverlays() {
            console.log('add overlays');
            $body.append($container).append($mapCopy);
            
        }
        
        function resetFilter() {
            filter = {
                curlPosition: 1
            };
        }
        
        // 1 = no curl
        // -1 = page all gone
        function updateFilter() {
            $mapCopy.css('webkitFilter',
            'custom(url(assets/shaders/page-curl.vs) mix(url(assets/shaders/page-curl.fs) normal source-atop), 50 50 border-box, transform perspective(1000) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg), curlPosition ' + filter.curlPosition + ' 0, curlDirection 135, curlRadius 0.2, bleedThrough 0.5)');
        }
        

        function openResolve() {
            console.log('open resolve');
            
            instance.hideMaps();
            $container.css('z-index', 1);
            dragging = false;
        }
        
        function closeResolve() {
            dragging = false;
            instance.hideMaps();
        }
        
        function handle_TOUCHSTART(e) {
            startX = e.originalEvent.touches[0].pageX;
            $('#curl-spot').bind('touchmove.map', handle_TOUCHMOVE);
            $('#curl-spot').bind('touchend.map', handle_TOUCHEND);
            resetFilter();
            dragging = true;
            instance.draw();
        }
        
        function handle_TOUCHMOVE(e) {
            var pageX = e.originalEvent.touches[0].pageX;
            var pageY = e.originalEvent.touches[0].pageY;
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
            var x = (pageX / window.innerWidth * 2) - 1;
            var y = (pageY / window.innerHeight * 2) - 1;
            filter.curlPosition = Math.min(x, y);
        }
        
        function handle_TOUCHEND(e) {
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
            
            var endX = e.originalEvent.changedTouches[0].pageX;
            
            if(endX >= startX) {
                // Return to normal
                $('#curl-spot').unbind('touchmove.map');
                $('#curl-spot').unbind('touchend.map');
                instance.hideMaps();
            } else {
                // Show gmap
                TweenMax.to(filter, 0.5, {
                    curlPosition: -1,
                    onComplete: openResolve
                });
            }
            
            console.log('touchend');
        }
        
        
        function addBackButton() {

            var button = $('<button id="map-back-button">Back</button>')[0];
            
            googleMap.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(button);
            google.maps.event.addDomListener(button, 'click', function() {
                //instance.hideMaps();
                $mapCopy.css('z-index', 1);
                dragging = true;
                filter.curlPosition = -1;
                instance.draw();
                
                TweenMax.to(filter, 2, {
                    curlPosition: 1,
                    ease: Quint.easeOut,
                    onComplete: closeResolve
                });

            });
        }
        
        function initGoogleMap() {
            var mapOptions = {
                center: new google.maps.LatLng(36.4333, -118.6833),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            
            googleMap = new google.maps.Map($container[0], mapOptions);
            addBackButton();
        }
        
                
        function createOverlays() {
            // Create the google map container
            $container = $('<div id="map-canvas">');

            // Create our map copy
            $mapCopy = $section.clone();
            $mapCopy.css({
                position: 'absolute',
                top: '5vh',
                left: '-10vw'
            }).addClass('map-overlay');
        }
        
        instance.handleTouchStart = handle_TOUCHSTART;
        
        instance.prepareMaps = function() {
            addOverlays();
            instance.hideMaps();
        }
        
        instance.showMaps = function() {
            console.log('show maps');
            addOverlays();
            $container.css('z-index', 1);
            $mapCopy.css('z-index', 1);
        }

        instance.hideMaps = function() {
            console.log('hide maps');
            $container.css('z-index', -1);
            $mapCopy.css('z-index', -1);
        }

        instance.init = function () {
            
            var mapOptions;
            
            $body = $('body');
            createOverlays();
            resetFilter();
            addOverlays();
            initGoogleMap();
            instance.hideMaps();
        };

        instance.draw = function () {
            if (dragging) {
                updateFilter();
                requestAnimationFrame(instance.draw);
            }
        };

        instance.render = function () {

        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            if( !$container ) {
                return;
            } 
            $container.remove();
            $mapCopy.remove();
        };

      
        instance.init();
    };

	return MapElement;
});


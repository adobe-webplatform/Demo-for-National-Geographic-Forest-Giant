/*global define $ TweenMax Quad Quint TimelineMax iScroll google*/
define([], function (require) {

    var MapElement;

    MapElement = function ($section) {
        var instance = this,
            $body,
            $container,
            $mapCopy,
            googleMap,
            startX = 0;

        function addMaps() {
            console.log('add maps');
            
            $container = $('<div id="map-canvas">');
            $mapCopy.css({
                position: 'absolute',
                top: '5vh',
                left: '-10vw'
            });
            
            instance.hideMaps();
            
            $body.append($container).append($mapCopy);
        }
        
        function handle_TOUCHMOVE(e) {
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
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
                instance.hideMaps();
                $container.css('z-index', 1);
            }
            
            console.log('touchend');
        }
        
        function handle_TOUCHSTART(e) {
            startX = e.originalEvent.touches[0].pageX;
            $('#curl-spot').bind('touchmove.map', handle_TOUCHMOVE);
            $('#curl-spot').bind('touchend.map', handle_TOUCHEND);
        }
        
        function addBackButton() {

            var button = $('<button id="map-back-button">Back</button>')[0];
            
            googleMap.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(button);
            google.maps.event.addDomListener(button, 'click', function() {
                instance.hideMaps();
            });
        }
        
        instance.handleTouchStart = handle_TOUCHSTART;
        
        instance.showMaps = function() {
            console.log('show maps');
            if( !$container ) {
                instance.init();
            }
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
            $mapCopy = $section.clone();
            addMaps();

            mapOptions = {
                center: new google.maps.LatLng(36.4333, -118.6833),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            
            googleMap = new google.maps.Map($container[0], mapOptions);
            addBackButton();
        };

        instance.draw = function () {
        
        };

        instance.render = function () {

        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            $container.remove();
            $container = null;
            $mapCopy.remove();
            $mapCopy = null;
        };

      
        instance.init();
    };

	return MapElement;
});


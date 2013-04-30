/*global define $ TweenMax Quad Quint TimelineMax iScroll google*/
define([], function (require) {

    var MapElement;

    MapElement = function ($section, pageScroll) {
        var instance = this,
            $container,
            $mapPage,
            googleMap,
            startX = 0,
            overlaysCreated = false,
            filter = null,
            allowDrawing = false;

        /*
        function addOverlays() {
            console.log('add overlays');
            $body.append($container).append($mapPage);
            
        }
        */
        
        function resetFilter() {
            filter = {
                curlPosition: 1
            };
        }
        
        // 1 = no curl
        // -1 = page all gone
        function updateFilter() {
            $mapPage.css('webkitFilter',
            'custom(url(assets/shaders/page-curl.vs) mix(url(assets/shaders/page-curl.fs) normal source-atop), 50 50 border-box, transform perspective(1000) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg), curlPosition ' + filter.curlPosition + ' 0, curlDirection 135, curlRadius 0.2, bleedThrough 0.5)');
        }
        

        function openResolve() {
            console.log('open resolve');
            
            instance.showMap();
            $mapPage.hide();
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
                instance.hideMap();
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
                $mapPage.show();
                allowDrawing = true;
                filter.curlPosition = -1;
                instance.draw();
                
                TweenMax.to(filter, 1.5, {
                    curlPosition: 1,
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
            createOverlays();
            resetFilter();
            initGoogleMap();
            instance.hideMap();

            allowDrawing = true;
            instance.draw();
            filter.curlPosition = 1;
            TweenMax.to(filter, 1, {
                curlPosition: 0.6,
                onComplete: function() { allowDrawing = false; }
            });
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
            if( !$container ) {
                return;
            } 
            // $container.remove();
        };

      
        instance.init();
    };

	return MapElement;
});


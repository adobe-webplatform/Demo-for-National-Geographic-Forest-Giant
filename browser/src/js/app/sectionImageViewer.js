/*global define $ TweenMax Quad Quint TimelineMax d3 Quart TweenLite*/
define([], function (require) {

    var SectionImageViewer,
        UserEvent = require('app/events/UserEvent');
    
    SectionImageViewer = function () {

        var instance = this,
            $frame,
            $zoomRange,
            $container,
            $slider,
            $sliderContainer,
            startPosition = {x: 0, y: -1800, _zoom: 0.1},
            _originX,
            _originY,
            _y = startPosition.y,
            _x = startPosition.x,
            _zoom = 0.1,
            deltaPosition,
            timeout,
            loadCount,
            tiles = [];

        instance.visible = false;

        function getPhysicalSize() {
            var _height,
                _width;

            _width = $('.container').width() * _zoom;
            _height = $('.container').height() * _zoom;
            return {w: _width, h: _height};
        }

        function getPhysicalCenter() {
            var x,
                y;

            x = $('.container').offset().left + (getPhysicalSize().w / 2);
            y = ($('.container').offset().top - $(window).scrollTop()) + (getPhysicalSize().h / 2); //if fixed need to exclude scroll top
            return {x: x, y: y};
        }

        /*
         * max/min zoom
         * WARNING: if layout changes ie. images not appended will change values
         */
        function getMaxZoom() {
            var max = $('.frame').width() / (parseFloat($('.container').width()) - 500);
            return max;
        }

        function getMinZoom() {
            return 1.5;
        }

        function padNumber(i) {
            if (i < 10) {
                return '0' + i;
            }
            return i;
        }

        function updateSlider() {
            var newX = (_zoom - getMaxZoom()) * $sliderContainer.width(); //TODO better calculate
            $slider.css({webkitTransform: 'translate(' + newX + 'px, 0px)'});
        }

        function updateTween() {
            _x = instance._x;
            _y = instance._y;
            _zoom = instance._zoom;

            updateZoom();
            updateOrigin();
            updateSlider();
        }

        function handle_img_LOAD_COMPLETE() {
            var goalY;
            
            updateTween();
           
            $zoomRange.attr('min', getMaxZoom() * 100);
            $zoomRange.attr('max', getMinZoom() * 100);
 
            $('.container').css('visibility', 'visible');

            goalY = ($('.container').height() / 2) - ($(window).height() / 2) - 200;
           
            TweenMax.to(instance, 2, {
                _x: 0, 
                _y: _y, 
                _zoom: getMaxZoom(), 
                delay: 1,
                onUpdate: updateTween,
                ease: Quad.easeInOut
            });

            TweenMax.to(instance, 4, {
                _x: 0,
                _y: goalY,
                delay: 2,
                onUpdate: updateTween,
                ease: Quad.easeInOut,
                onComplete: completeTween
            });
        }
        
        function handle_img_LOAD() {
            loadCount += 1;
            
            //TODO append fragment
            if (loadCount == 125) {
                for (var i = 0; i < tiles.length; i += 1) {
                    $container.append(tiles[i].img);
                }

                handle_img_LOAD_COMPLETE();
            }
            
            //hw accelerate
            $container.css({webkitTransform: 'translate3d(' + (-_x) + 'px, ' + (-_y) + 'px, 0px) scale(' + _zoom + ')'});
        }
        
        function loadTiles() {
            var width = 300,
                img,
                i = 1,
                x = 0, y = 0;
            
            //TODO preloader and append at once.
            for (i; i < 126; i += 1) {
                
                img = new Image();
                img.src = "./assets/images/xl/tiles_300/large_full_" + padNumber(i) + ".png";
                img.style.left = x + 'px';
                img.style.top = y + 'px';
                img.style.zIndex = "1";
                
                if (i % 7 == 0) {
                    x = 0;
                    y += 300;
                } else {
                    x += 300;
                }
                
                img.addEventListener('load', handle_img_LOAD);
                tiles.push({img: img, loaded: false});
            }
        }

        /**
         * update methods
         */
        function updateOrigin() {
            _originX = _x + $container.width() / 2;
            _originY = _y + $container.height() / 2;				
            $container.css({'webkit-transform-origin': _originX + 'px ' + _originY + 'px'});
        }
        
        function updateZoom() {
            
            //hw accelerate
            $container.css({webkitTransform: 'translate3d(' + (-_x) + 'px, ' + (-_y) + 'px, 0px) scale(' + _zoom + ')'});
            
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                //updateVisibility();  //performance hit!
                                    
                //redraw crisper
                $container.css({webkitTransform: 'translate(' + (-_x) + 'px, ' + (-_y) + 'px) scale(' + _zoom + ')'});
            }, 1000);
        }
        
        /**
         * not used, performance hit!
         */
        function updateVisibility() {
            for (var i = 0; i < tiles.length; i += 1) {
                var tile = $(tiles[i].img),
                    tileX,
                    tileY;
                    
                tileX = tile.offset().left - $('#frame').offset().left;
                tileY = tile.offset().top - $('#frame').offset().top;
                
                if (tileX - (300 * _zoom) > $('#frame').width() || 
                    tileX + (300 * _zoom) < 0 || 
                    tileY - (300 * _zoom) > $('#frame').height() || 
                    tileY + (300 * _zoom) < 0) 
                {
                    if (tiles[i].img.style.opacity !== '0') {
                        tiles[i].img.style.opacity = '0';
                        //tiles[i].style.display = 'none';
                        //tiles[i].style.visibility = 'hidden';
                    }
                } else if (tiles[i].img.style.opacity !== '1') {
                    tiles[i].img.style.opacity = '1';
                    //tiles[i].style.display = 'block';
                    //tiles[i].style.visibility = 'visible';
                }
            }
        }

        function handle_MOVE(e) {
            var size = getPhysicalSize(),
                pos = getPhysicalCenter(),
                newX = deltaPosition.x - e.x,
                newY = deltaPosition.y - e.y,
                MARGIN = -140;
            

            console.log('size', size);
            console.log('pos', pos);
            console.log('win', $(window).width(), $(window).height());

            //MANAGE BOUNDS
            if (newX > _x) {
                if (pos.x + size.w / 2 > $(window).width() - MARGIN){
                    _x = newX;
                }
            } else if (newX < _x) {
                if(pos.x - size.w / 2 < MARGIN) {
                    _x = newX;
                }
            }

            if (newY > _y) {
                if (pos.y + size.h / 2 > $(window).height() - MARGIN) {
                    _y = newY;
                }            
            } else if (newY < _y) {
                if (pos.y - size.h / 2 < MARGIN) {
                    _y = newY;
                }            
            }

            updateZoom();
            updateOrigin();
        }

        /**
         * touch events
         */
        function handle_container_TOUCHMOVE(e) {
            e.preventDefault();
            handle_MOVE({x: e.originalEvent.touches[0].pageX, y: e.originalEvent.touches[0].pageY});
        }

        function handle_container_TOUCHSTART(e) {
            e.preventDefault();
            deltaPosition = {x: _x + e.originalEvent.touches[0].pageX, y: _y + e.originalEvent.touches[0].pageY};
            $frame.bind('touchmove', handle_container_TOUCHMOVE);
        }
        
        function handle_container_TOUCHEND(e) {
            e.preventDefault();
            $frame.unbind('touchmove', handle_container_TOUCHMOVE);
        }

        /**
         * mouse events
         */
        function handle_container_MOUSE_MOVE(e) {
            e.preventDefault();
            handle_MOVE({x: e.pageX, y: e.pageY});
        }
        
        function handle_container_MOUSE_DOWN(e) {
            e.preventDefault();
            deltaPosition = {x: _x + e.pageX, y: _y + e.pageY};
            $frame.bind('mousemove', handle_container_MOUSE_MOVE);
        }
        
        function handle_container_MOUSE_UP(e) {
            e.preventDefault();
            $frame.unbind('mousemove', handle_container_MOUSE_MOVE);
        }
        
        /**
         * in/out buttons
         */
        function handle_zoomInBtn_CLICK(e) {
            e.preventDefault();

            var newZoom = _zoom + 0.1;

            if (newZoom <= getMinZoom()) {
                _zoom = newZoom;
            } else {
                _zoom = getMinZoom();
            }

            updateZoom();
            updateSlider();
        }
        
        function handle_zoomOutBtn_CLICK(e) {
            e.preventDefault();
            
            var newZoom = _zoom - 0.1;

            if (newZoom >= getMaxZoom()) {
                _zoom = newZoom;
            } else {
                _zoom = getMaxZoom();
            }

            updateZoom();
            updateSlider();
        }
        
        function handle_zoomRange_CHANGE(e) {
            _zoom = $('#imageViewer .zoomRange').val() / 100;
            updateOrigin();
            updateZoom();
        }

        function handle_MOUSEWHEEL(e) {
            e.preventDefault();
            
            var size = getPhysicalSize(),
                pos = getPhysicalCenter(),
                MARGIN = -140,
                d = e.originalEvent.wheelDeltaY,
                newY = _y + d;
            
            if (newY > _y) {
                if (pos.y + size.h / 2 > $(window).height() - MARGIN) {
                    _y = newY;
                }            
            } else if (newY < _y) {
                if (pos.y - size.h / 2 < MARGIN) {
                    _y = newY;
                }            
            }

            updateZoom();
            updateOrigin();
        }

        /**
         * custom slider
         *
         */
        function handle_slider_MOUSE_MOVE(e) {
            var newX = e.pageX - ($slider.width() / 2) - $sliderContainer.offset().left,
                percent,
                value;

            if (newX < 0) {           
                console.log('one');
                updateOrigin();
                updateZoom();
                newX = 0;
            } else if (newX > $sliderContainer.width() - $slider.width()) {
                console.log('two');
                newX = $sliderContainer.width() - $slider.width();
            }

            $slider.css({webkitTransform: 'translate(' + newX + 'px, 0px)'});
            percent = newX / ($sliderContainer.width() - $slider.width());
            
            value = parseFloat($zoomRange.attr('min')) + (percent * ($zoomRange.attr('max') - $zoomRange.attr('min')));
            $zoomRange.val(value);
            
            handle_zoomRange_CHANGE(null);
        }

        function handle_slider_MOUSE_DOWN(e) {
            $sliderContainer.bind('mousemove', handle_slider_MOUSE_MOVE);
        }

        function handle_slider_MOUSE_UP(e) {
            $sliderContainer.unbind('mousemove', handle_slider_MOUSE_MOVE);
        }

        /**
         * close
         */
        function handle_closeBtn_CLICK(e) {
            history.pushState('home', 'home', location.pathname);
            instance.destroy();
        }

        function completeTween() {
            $slider.bind('mousedown', handle_slider_MOUSE_DOWN);
            $sliderContainer.bind('mouseup', handle_slider_MOUSE_UP);
			
            $('body').bind('mousewheel', handle_MOUSEWHEEL);

            $('#imageViewer .popup-close').bind('click', handle_closeBtn_CLICK);
            $('#imageViewer .zoomInBtn').bind('click', handle_zoomInBtn_CLICK);
            $('#imageViewer .zoomOutBtn').bind('click', handle_zoomOutBtn_CLICK);
            $zoomRange.bind('change', handle_zoomRange_CHANGE);

            $frame.bind('mousedown', handle_container_MOUSE_DOWN);
            $frame.bind('mouseup', handle_container_MOUSE_UP);
            $frame.bind('touchstart', handle_container_TOUCHSTART);
            $frame.bind('touchend', handle_container_TOUCHEND);
        }

        instance.show = function () {
            $('#imageViewer').css('display', 'block');
            instance.visible = true;
            instance.setup();
        }

        instance.setup = function () {
            //_zoom = getMaxZoom();

            _x = startPosition.x;
            _y = startPosition.y;
            _zoom = getMinZoom();
                  
            loadCount = 0;

            instance._x = _x;
            instance._y = _y;
            instance._zoom = _zoom;

            $frame = $('#imageViewer .frame');
            $zoomRange = $('#imageViewer .zoomRange');
            $container = $('#imageViewer .container');
            $slider = $('#zoomSlider');
            $sliderContainer = $('#zoomSliderContainer');
    
            updateZoom();
            updateOrigin();

            loadTiles();
        }

        instance.destroy = function () {
            $container.empty();
            $('#imageViewer').css('display', 'none');
            instance.visible = false;

            $slider.unbind('mousedown');
            $sliderContainer.unbind('mouseup');
			
            $('body').unbind('mousewheel');

            $('#imageViewer .popup-close').unbind('click');
            $('#imageViewer .zoomInBtn').unbind('click');
            $('#imageViewer .zoomOutBtn').unbind('click');
            $zoomRange.unbind('change');

            $frame.unbind('mousedown');
            $frame.unbind('mouseup');
            $frame.unbind('touchstart');
            $frame.unbind('touchend');

        }

        function init() {
            //instance.show(); //NOTE if added right away works, otherwise bounds issues
        }

        init();
    };

	return SectionImageViewer;
});

/*global define $ TweenMax Quad Quint TimelineMax iScroll Bounce Elastic Back*/
define([], function (require) {

    var TransformElement;

    TransformElement = function (element, scroll) {
        var instance = this,
            $body,
            $el = $(element),
            $container,
            $transformEl,
            $resolveEl,
            opening = false,
            dragging = false,
            transform = {x: 0, y: 0, rotation: 0, scale: 1},
            deltaMidpoint = {x: 0, y: 0},
            deltaScale = 1,
            deltaDistance = 0,
            deltaAngle = 0,
            deltaRotation = 0,
            SCALE_DIVIDER = 100;

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

        function addContainer() {
            $container = $('<div>');
            $container.addClass('transition-container');
            $body.append($container);
        }

        function addTransformElement() {
            $transformEl = $('<div>');
            $transformEl.addClass('transition-transform');
            $transformEl.css({
                'top': $el.offset().top,
                'left': $el.offset().left,
                'width': $el.width(),
                'height': $el.height(),
                'background-image': $el.css('background-image')
            });
            $container.append($transformEl);
  
            $resolveEl = $transformEl.clone();
            $resolveEl.css({
                'left': '0px', 
                'top': '0px', 
                'width': '100%', 
                'height': '100%', 
                'background-color': 'rgba(0, 0, 0, .8)', 
                'background-size': 'contain', 
                'background-position': 'center', 
                'background-repeat': 'no-repeat', 
                'webkitFilter': 'none', 
                'opacity': '0'
            });
            $container.append($resolveEl);
        }

        function showTransformElement() {
            $el.css({opacity: 0});
            $transformEl.css({opacity: 1});
        }

        function openResolve() {

            dragging = false;

            $container.css({'pointer-events': 'auto'});
            $resolveEl.css({opacity: 1, 'pointer-events': 'auto'});
            $resolveEl.bind('touchstart', handle_resolveEl_TOUCHSTART);
            $resolveEl.bind('click', handle_resolveEl_CLICK);

            $transformEl.css({opacity: 0});

            var replacementId = $el.data('replacement');
            if(replacementId) {
                var $replacementEl = $('#' + replacementId);
                $resolveEl.append($replacementEl);
                $replacementEl.show();
            }
        }

        function closeResolve() {
            dragging = false;
            $container.css({'pointer-events': 'none'});
            $transformEl.css({opacity: 0});
            $el.css({opacity: 1});
            scroll.enable();
        }

        function calculateDeltas(t1, t2) {
            deltaMidpoint = getMidpoint(t1, t2);
            deltaDistance = getDistance(t1, t2) / SCALE_DIVIDER;
            deltaScale = transform.scale;
            deltaAngle = getAngle(t1, t2);
            deltaMidpoint = {x: deltaMidpoint.x - transform.x, y: deltaMidpoint.y - transform.y};
        }

        function handle_resolveEl_TOUCHSTART(e) {
            var touches = e.originalEvent.touches,
                t1, t2;
    
            //e.preventDefault();
            e.stopPropagation();

            if (touches.length == 2) {

                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};

                dragging = true;

                //$resolveEl.remove();
                $resolveEl.css({opacity: 0, 'pointer-events': 'none'});
                $transformEl.css({'opacity': 1});
                
                instance.startRequestAnimationFrame();

                calculateDeltas(t1, t2);

                $body.bind('touchend', handle_transform_TOUCHEND);
                $body.bind('touchmove', handle_transform_TOUCHMOVE);
                
                $resolveEl.unbind('touchstart');
                $resolveEl.unbind('click');
            }
        }

        function handle_TOUCHSTART(e) {
            var touches = e.originalEvent.touches,
                t1, t2;

            if (touches.length == 2) {
                e.preventDefault();
                e.stopPropagation();

                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};

                TweenMax.killTweensOf(transform);
                dragging = true;

                showTransformElement();
                
                instance.startRequestAnimationFrame();
                scroll.disable();
            
                calculateDeltas(t1, t2);

                $body.bind('touchend', handle_transform_TOUCHEND);
                $body.bind('touchmove', handle_transform_TOUCHMOVE);
            }
        }

        function open() {
            var fullscale = window.innerHeight / $el.height();
            
            new TweenMax.to(transform, 0.5, {
                x: - $el.offset().left + (window.innerWidth / 2) - ($el.width() / 2),
                y: - $el.offset().top + (window.innerHeight / 2) - ($el.height() / 2),
                scale: fullscale, 
                rotation: 0, 
                ease: Back.easeOut,
                onComplete: openResolve
            });
        }

        function close() {
            new TweenMax.to(transform, 0.5, {
                x: 0, 
                y: 0, 
                scale: 1, 
                rotation: 0, 
                ease: Back.easeOut,
                onComplete: closeResolve
            });
        }
        
        function handle_transform_TOUCHEND(e) {

            e.preventDefault();
            e.stopPropagation();
            
            $body.unbind('touchend');
            $body.unbind('touchmove');

            if (opening) {
                open();
            } else {
                close();
            }
        }

        function handle_transform_TOUCHMOVE(e) {
            var touches = e.originalEvent.touches,
                t1, t2,
                newAngle,
                newMidpoint,
                newDistance;

            if (touches.length == 2) {

                e.preventDefault();
                e.stopPropagation();

                t1 = {x: touches[0].pageX, y: touches[0].pageY};
                t2 = {x: touches[1].pageX, y: touches[1].pageY};

                //angle
                newAngle = getAngle(t1, t2) - deltaAngle;
                transform.rotation = newAngle > 180 ? newAngle - 180 : newAngle;

                //calculate scale based on current scale
                newDistance = getDistance(t1, t2) / SCALE_DIVIDER;
                transform.scale = newDistance * deltaScale / deltaDistance;
                transform.scale = transform.scale > 1 ? transform.scale : 1;

                //calculate transform
                newMidpoint = getMidpoint(t1, t2);
                transform.x = newMidpoint.x - deltaMidpoint.x;
                transform.y = newMidpoint.y - deltaMidpoint.y;
                
                opening = transform.scale > 1 ? true : false;
            }
        }

        function handle_CLICK(e) {
            dragging = true;

            showTransformElement();
            
            instance.startRequestAnimationFrame();
            scroll.disable();
            open();
        }

        function handle_resolveEl_CLICK(e) {
            dragging = true;

            $resolveEl.css({opacity: 0, 'pointer-events': 'none'});
            $transformEl.css({'opacity': 1});
            
            instance.startRequestAnimationFrame();

            $resolveEl.unbind('touchstart');
            $resolveEl.unbind('click');
            close();
        }

        instance.init = function () {
            $body = $('body');
            $el.bind('touchstart', handle_TOUCHSTART);
            $el.bind('click', handle_CLICK);
            addContainer();
            addTransformElement();
            instance.waitingRequestAnimationFrame = false;
        };

        instance.startRequestAnimationFrame = function () {
            if (instance.waitingRequestAnimationFrame)
                return;
            instance.waitingRequestAnimationFrame = true;
            requestAnimationFrame(instance.draw);
        }

        instance.draw = function () {
            instance.waitingRequestAnimationFrame = false;
            if (!dragging)
                return;
            TweenMax.set($transformEl, {css: {x: transform.x, y: transform.y, scale: transform.scale, rotation: transform.rotation}});
            instance.startRequestAnimationFrame();
        };

        instance.render = function () {

        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            dragging = false;
            $container.empty();
            $container.remove();
        };

        instance.init();
    };

	return TransformElement;
});


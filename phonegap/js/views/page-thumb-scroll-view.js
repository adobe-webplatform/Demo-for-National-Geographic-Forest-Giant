/*global define $ TweenMax Quad Quint TimelineMax iScroll*/
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

    var PageThumbView,
        PageThumb = require('views/page-thumb');

    PageThumbView = function (id, img) {
        var instance = this,
            $el = $('<section class="view page-thumb-view">'),
            $content = $('<div class="view page-thumb-view-content">'),
            
            //$scroll = $('<div id="article-pages-scroll-view-' + id + '" class="view article-pages-scroll-view">'),
            //$content = $('<div class="article-pages-content-view">'),
            thumbScroll,
            expander;

        var target;
        var startPt1;
        var startMid;
        var startDistance;
        var newScale;
        var origClientRect, startClientRect;
        var transformOrigin;
        var fullScreenTransform;
        var startSingleTap = false;
        var isFullScreen = false;
        var thumbnailScale = 0.2;


        /* Expand to fill the screen */
        function expandToFullScreen(evt) {
            $el.removeClass('dragging');
            var targetElement = evt.target;

            var scale = 1 / thumbnailScale;

            var newX = transformOrigin.x * scale;
            var newY = transformOrigin.y * scale;

            var translateX = -(startClientRect.left + transformOrigin.x - newX);
            var translateY = -(startClientRect.top + transformOrigin.y - newY);

            // currentPageIndex = Array.prototype.slice.call( targetElement.parentNode.children ).indexOf( targetElement );
            
            var targetRect = targetElement.getBoundingClientRect();

            var scrollPosX = -targetRect.left;
            
            translateX += scrollPosX / thumbnailScale;
            scrollPosX = 0;

            var translateStr = 'translate(' + translateX + 'px, ' + translateY + 'px)';
            var scaleStr = 'scale(' + scale + ')';
            
            fullScreenTransform = translateStr + ' ' + scaleStr;
            $el.css({
                'transition': '-webkit-transform 0.5s',
                'transform': fullScreenTransform
            });
            isFullScreen = true;
        }
        
        
        /* Return to original size & position before dragging */
        function revertSize() {
            $el.css({
                'transition': '-webkit-transform 0.5s',
                'transform': 'none'
            });
        }

        function shrinkToThumbnails(event, data) {
            contentWrapper.classList.add('dragging');
            
            var transformOrigin = data.transformOrigin;
            var startClientRect = data.startClientRect;

            var scale = thumbnailScale;
            
            var newX = transformOrigin.x * scale;
            var newY = transformOrigin.y * scale;
            
            var translateX = -(startClientRect.left + transformOrigin.x - newX);
            var translateY = -(startClientRect.top + transformOrigin.y - newY);

            var pageOffset = pageOffsets[ currentPageIndex ];

            var scaledHeight = window.innerHeight * thumbnailScale; // 640 * 0.2 = 128
            var offsetY = ( scaledHeight + -(transformOrigin.y) ); // 128 + 153 = 281
            var translateY = offsetY - (offsetY * thumbnailScale); // 281 - (281 * 0.2) = 225
            
            var translateX = -(transformOrigin.x - (transformOrigin.x * thumbnailScale));
            translateX -= pageOffset * thumbnailScale;
            
            // TODO: 
            
            var translateStr = 'translate(' + translateX + 'px, ' + translateY + 'px)';
            var scaleStr = 'scale(' + scale + ')';
            var transform = translateStr + ' ' + scaleStr;
            
            $el.css({
                'transition': '-webkit-transform 0.5s',
                'transform': transform
            });

            /*
            contentWrapper.style.webkitTransition = '-webkit-transform 0.5s';
            contentWrapper.style.webkitTransform = transform;  
            thumbnailWrapper.style.webkitTransition = '-webkit-transform 0.5s';
            thumbnailWrapper.style.webkitTransform = 'scale(' + 1/thumbnailScale + ') translateZ(0)';   
            */ 
            // switchToThumbnails();

            isFullScreen = false;
        }
        
        
        function getDistance(point1, point2) {
            var distance,
                dx,
                dy;
        
            dx = point1.x - point2.x;
            dy = point1.y - point2.y;
            distance = Math.sqrt((dx * dx) + (dy * dy));
        
            return distance;
        }
    
        function getMidPoint(point1, point2) {
            return {
                x: (point1.x + point2.x) / 2,
                y: (point1.y + point2.y) / 2
            }
        }

		function handle_TOUCHSTART(jqEvt) {
			var evt = jqEvt.originalEvent;
			evt.preventDefault();  //forces touch end to work correctly
			
			if( evt.touches.length == 1 ) {
                startSingleTap = true;
                startPt1 = {
                    x: evt.touches[0].pageX,
                    y: evt.touches[0].pageY
                };
            } else if( evt.touches.length > 1 ) {
                evt.stopPropagation();
                $el.addClass('dragging'); // may not be needed

                var currClientRect = element.getBoundingClientRect();

                if( !origClientRect ) {
                    origClientRect = currClientRect;
                }
                startClientRect = currClientRect;
        
                startPt1 = {
                    x: evt.touches[0].pageX,
                    y: evt.touches[0].pageY
                };
                var startPt2 = {
                    x: evt.touches[1].pageX,
                    y: evt.touches[1].pageY
                };
                startMid = getMidPoint(startPt1, startPt2);
            
                var elemOffsetX = startMid.x - currClientRect.left;
                var elemOffsetY = startMid.y - currClientRect.top;
                transformOrigin = {
                    x: elemOffsetX,
                    y: elemOffsetY
                };
            
                $el.css('transform-origin', elemOffsetX + 'px ' + elemOffsetY + 'px');
                startDistance = getDistance(startPt1, startPt2);
            }
		}
		
		function handle_TOUCHMOVE(jqEvt) {
		    var evt = jqEvt.originalEvent;
            evt.stopPropagation();
            if(evt.touches.length < 2){
                return;
            }
        
            var touch1 = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            };
            var touch2 = {
                x: evt.touches[1].pageX,
                y: evt.touches[1].pageY
            };
            var touchDistance = getDistance(touch1, touch2);
            var diff = touchDistance / startDistance;
            var currentMid = getMidPoint(touch1, touch2);
            
            startMid = startMid || currentMid;
            
            var dragDeltaX = currentMid.x - startMid.x;
            var dragDeltaY = currentMid.y - startMid.y;
        
            newScale = diff;
            
            var transform = 
                "translate(" + dragDeltaX + 'px, ' + dragDeltaY + 'px) ' +
                "scale(" + newScale + "," + newScale + ") translateZ(0)";

            $el.css('transform', transform);
            /*
            if( !isFullScreen && data.scale > 2 ) {
                switchToContent();
            } else if( isFullScreen && data.scale < 0.5 ) {
                switchToThumbnails();
            }
            
            if( !isFullScreen ) {
                if( data.scale > 2 && useThumbnails ) {
                    switchToContent();
                } else if( data.scale < 1.7 && !useThumbnails ) {
                    switchToThumbnails();
                }
            } else {
                if( data.scale < 0.5 && !useThumbnails ) {
                    switchToThumbnails();
                } else if( data.scale > 0.7 && useThumbnails ) {
                    switchToContent();
                }
            }
            */
		}

		function handle_TOUCHEND(jqEvt) {
		    var evt = jqEvt.originalEvent;
			
            if( startSingleTap ) {
                var currentPosition = {
                    x: evt.changedTouches[0].pageX,
                    y: evt.changedTouches[0].pageY
                };
                var delta = getDistance(startPt1, currentPosition);
                if( delta < 10 ) {
                    evt.stopPropagation();
                    transformOrigin = {
                        x: 0,
                        y: 0
                    };
                    startClientRect = $el[0].getBoundingClientRect();
                    $el.css({
                        'transform-origin': '0 0',
                        'transform': fullScreenTransform
                    });
                    expandToFullScreen(evt);
                }

                startSingleTap = false;
                return;
            } else {
                if( events.dragend ) {
                    events.dragend.call(this, evt);
                }
            }
            if( newScale > 1.1 && !isFullScreen ) {
                expandToFullScreen(evt);
            } else if( newScale < 0.9 && isFullScreen ) {
                shrinkToThumbnails(evt);
            } else {
                revertSize();
            }
		}

        function addEventListeners() {
            
			$el.bind('touchstart', handle_TOUCHSTART);
			$el.bind('touchend', handle_TOUCHEND);
			$el.bind('touchmove', handle_TOUCHMOVE);

        }
        function addExpansion() {
            expander = new Expander($el);
        }

        function addScroll() {
            thumbScroll = new iScroll($('.page-thumb-view')[0], {
                momentum: true,
                hScrollbar: false
            });
        }

        function addPages() {
            var i,
                x = 10,
                pageThumb;

            for (i = 0; i < 20; i += 1) {
                pageThumb = new PageThumb();
                pageThumb.setPosition(x, 0);
                pageThumb.setSize('200', '20vh');
                $content.append(pageThumb.render());
                
                x += 210;
            }

            $content.css('width', x + 'px');
            //pageScroll.refresh();
        }

        instance.init = function () {
            $el.append($content);
            // $el.css({'background-image': 'url(' + img + ')', 'background-size': window.innerWidth + 'px auto'});
        };

        instance.setPosition = function (x, y) {
            $el.css('left', x);
        };

        instance.draw = function () {
            
        };

        instance.show = function () {
            addPages();
            addScroll();
            addEventListeners();
            //if (id > 0) {
            //    addPages();
            //    addScroll();
            //}
        };

        instance.render = function () {
            //if (id > 0) {
                //$el.append($scroll);
                //$scroll.append($content);
            //} else {
                //cover
            //}
            return $el;
        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            $el.remove();
        };

        instance.init();
    };

	return PageThumbView;
});

/*global define $ TweenMax Quad Quint TimelineMax*/
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

    var TOCViewButton,
        AppEvent = require('events/app-event');
    
    TOCViewButton = function (id, img) {
        var instance = this,
            $el = $('<div class="view toc-view-button">'),
            $transitionContainer,
            $transitionEl,
            timeline;

        instance.id = id;

        /*
        function handle_TRANSITION_COMPLETE() {
            AppEvent.GOTO_VIEW.dispatch(id);
        };
        */

        /*
        function handle_CLICK(e) {
            var $this = $(this),
                size = $el.width() / window.innerWidth;

            e.preventDefault();
            e.stopPropagation();

            $el.unbind('click');

            $transitionContainer = $('<div>');
            $transitionContainer.addClass('transition-container');
            $('body').append($transitionContainer);

            $transitionEl = $('<div>');
            $transitionEl.addClass('transition-element');
            $transitionEl.css({'background-image': $(this).css('background-image')});
            $transitionContainer.append($transitionEl);

            new TweenMax.set($transitionEl, {
                css: {
                    x: $(this).offset().left - ($(this).width() * 0.6), 
                    y: $(this).offset().top - ($(this).height() * 0.6), 
                    z: 0.01,
                    scale: size
                }
            });

            $el.css({'opacity': '0'});

            timeline = new TimelineMax({onComplete: handle_TRANSITION_COMPLETE});
            timeline.timeScale(0.5);

            timeline.insert(
                new TweenMax.to($transitionEl, 0.5, {
                    css: {x: 0, y: 0},
                    ease: Quint.easeInOut
                })
            );
            timeline.insert(
                new TweenMax.to($transitionEl, 0.5, {
                    css: {rotationY: 20},
                    ease: Quint.easeIn
                })
            );
            timeline.insert(
                new TweenMax.to($transitionEl, 0.5, {
                    css: {rotationY: 0},
                    delay: 0.5,
                    ease: Quint.easeOut
                })
            );
            timeline.insert(
                new TweenMax.to($transitionEl, 1, {
                    css: {scale: 1},
                    ease: Quint.easeInOut
                })
            );
            
            AppEvent.GOTO_VIEW.dispatch(id);
        }
        */

        instance.init = function () {
            $el.css({backgroundImage: 'url(' + img + ')'});
        };

        instance.setSize = function (w, h) {
            $el.css({
                width: w,
                height: h
            });
        };

        instance.setPosition = function (x, y) {
            $el.css({
                top: y + 'px',
                left: x + 'px'
            });
        };

        instance.draw = function () {
            
        };

        instance.render = function () {
            $el.data('toc-id', id);
            return $el;
        };

        instance.show = function () {
            TweenMax.set($el, {scale: 1});
        };

        /*
        instance.animIn = function () {
            new TweenMax.to($el, 0.5, {opacity: 1});
        };

        instance.animOut = function () {
            new TweenMax.to($el, 0.5, {rotationY: 30, opacity: 0});
        };
        */

        instance.destroy = function () {

            if ($transitionContainer) {
                $transitionContainer.remove();
                $transitionContainer = null;
            }

            $el.unbind('click');
        };

        instance.init();
    };

	return TOCViewButton;
});

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

    var TOCView,
        AppEvent = require('events/app-event'),
        TOCViewButton = require('views/toc-view-button');
    
    require('iscroll');

    TOCView = function () {
        var instance = this,
            $el = $('<div id="toc-view" class="view toc-view">'),
            $contents = $('<div class="view toc-contents">'),
            $transitionContainer,
            timeline,
            dir = './assets/images/toc/',
            selectedBtn,
            padding = 10,
            tocScroll,
            lgWidth = (window.innerWidth / 2) - (padding * 2),
            colHeight = (window.innerHeight / 2) - (padding * 2),
            smWidth = colHeight * 2,
            buttons = [],
            contents = [
                {img: 'cover.jpg', content: '<img class="toc-logo" src="assets/images/toc/ng_logo.png">'},
                {img: 'article1.jpg', content: '<span class="toc-title">Forest Giant</span>'},
                {img: 'article3.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article4.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article2.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article5.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article6.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article7.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article3.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article4.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article2.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article5.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article6.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article7.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'}
            ];

        function buttonAnimate(callback) {
            var $button = buttons[selectedBtn].render(),
                size = $button.width() / window.innerWidth,
                tween1, tween2, tween3, tween4,
                $transitionEl;

            $transitionContainer = $('<div>');
            $transitionContainer.addClass('transition-container');
            $('body').append($transitionContainer);

            $transitionEl = $('<div>');
            $transitionEl.addClass('transition-element');
            $transitionEl.css({'background-image': $button.css('background-image')});
            $transitionContainer.append($transitionEl);

            new TweenMax.set($transitionEl, {
                css: {
                    x: $button.offset().left - ($button.width() * 0.6), 
                    y: $button.offset().top - ($button.height() * 0.6), 
                    z: 0.01,
                    scale: size
                }
            });

            $button.css({'opacity': '0'});

            tween1 = new TweenMax.to($transitionEl, 0.5, {
                css: {x: 0, y: 0},
                ease: Quint.easeInOut
            });

            tween2 = new TweenMax.to($transitionEl, 0.5, {
                css: {rotationY: 20},
                ease: Quint.easeIn
            });

            tween3 = new TweenMax.to($transitionEl, 0.5, {
                css: {rotationY: 0},
                delay: 0.5,
                ease: Quint.easeOut
            });

            tween4 = new TweenMax.to($transitionEl, 1, {
                css: {scale: 1},
                ease: Quint.easeInOut
            });

            timeline = new TimelineMax({onComplete: callback});
            timeline.timeScale(0.5);
            timeline.insert(tween1);
            timeline.insert(tween2);
            timeline.insert(tween3);
            timeline.insert(tween4);
        }

        function addEventListeners() {
            console.log('toc add event listeners');
            for (var i = 0; i < buttons.length; i += 1) {
                buttons[i].render().bind('click', handle_btn_CLICK)
            }
        }

        function removeEventListeners() {
            console.log('toc remove event listeners');
            for (var i = 0; i < buttons.length; i += 1) {
                buttons[i].render().unbind('click');
            }
        }

        function handle_btn_CLICK(e) {
            console.log('toc btn click');
            
            e.preventDefault();
            e.stopPropagation();

            var id = $(e.target).data('toc-id');
            selectedBtn = id > 1 ? id - 1 : 0;
            AppEvent.GOTO_VIEW.dispatch(id);
            removeEventListeners();
        }

        function populateButtons() {
            var i,
                x = padding,
                y = padding,
                max_width = padding,
                button,
                scale = 2.2,
                id;

            for (i = 0; i < contents.length; i += 1) {
                id = i > 0 ? i + 1: 0;
                button = new TOCViewButton(id, dir + contents[i].img);
                button.setSize(window.innerWidth / scale, window.innerHeight / scale);
                button.setPosition(x, y);
                button.render();
                buttons.push(button);

                if (i % Math.round(contents.length / 2) === 0 && i !== 0) {
                    max_width = x;
                    y += (window.innerHeight / scale) + padding;
                    x = padding;
                } else {
                    x += (window.innerWidth / scale) + padding;
                }

                button.render().html(contents[i].content);
                $contents.append(button.render());
            }
            
            $contents.css('width', max_width);
        }

        instance.init = function () {
            if (buttons.length === 0) {
                populateButtons();
            }
        };

        instance.show = function () {
            tocScroll = new iScroll('toc-view', {
                momentum: true,
                bounce: true,
                hScrollbar: false,
                vScrollbar: false
            });

            for (var i = 0; i < buttons.length; i += 1) {
                buttons[i].show();
            }

            addEventListeners();
        };

        instance.render = function () {
            $el.append($contents);
            return $el;
        };

        instance.animIn = function (callback) {
            for (var i = 0; i < buttons.length; i += 1) {

                new TweenMax.to(buttons[i].render(), .6, {
                    opacity: 1,
                    delay: i / 10
                });
            }

            callback();
        };

        instance.animOut = function (callback) {
            var delay, i, wait = 0;

            tocScroll.destroy();

            //tween out
            for (i = 0; i < buttons.length; i += 1) {
                delay = Math.abs(selectedBtn - i) / 10;

                if (i !== selectedBtn) {

                    new TweenMax.to(buttons[i].render(), .6, {
                        scale: 0.5, 
                        opacity: 0, 
                        ease: Quint.easeOut,
                        delay: delay                
                    });
                }
            }

            setTimeout(function () {
                buttonAnimate(callback);
            }, 1000);
        };

        instance.destroy = function () {

            $transitionContainer.remove();

            for (var i = 0; i < buttons.length; i += 1) {
                buttons[i].destroy();
            }

            $el.remove();
        };
    };

	return TOCView;
});

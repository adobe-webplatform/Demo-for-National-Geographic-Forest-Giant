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

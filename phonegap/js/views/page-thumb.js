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

    var PageThumb;
    
    PageThumb = function (img) {
        var instance = this,
            $el = $('<div class="view page-thumb">');

        instance.init = function () {
            // $el.css({backgroundImage: 'url(' + img + ')'});
        };

        instance.setSize = function (w, h) {
            $el.css({width: w, height: h});
        };

        instance.setPosition = function (x, y) {
            TweenMax.set($el, {css: {x: x, y: y}});
        };

        instance.draw = function () {
            
        };

        instance.render = function () {
            return $el;
        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            $el.remove();
        };

        instance.init();
    };

	return PageThumb;
});

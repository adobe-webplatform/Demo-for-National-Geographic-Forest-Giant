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

    var PageView;

    PageView = function (content) {
        var instance = this,
            $el = $('<section class="view page-view">');

        instance.init = function () {
            $el.html(content);
        };

        instance.setPosition = function (x, y) {
            $el.css('left', x);
        };

        instance.show = function () {
            if ($el.find('.page-full').length > 0) {
                $el.addClass('page-view-full');
            }
            if ($el.find('.page-exact').length > 0) {
                $el.addClass('page-view-exact');
            }
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

	return PageView;
});


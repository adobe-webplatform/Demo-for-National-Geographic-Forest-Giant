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

    var CanvasTree;
    
    CanvasTree = function () {

        var instance = this,
            $listItems,
            $canvas,
            ctx,
            currentNumber = 0,
            list = [];

        function handle_img_LOAD() {
            instance.draw();
        }

        function handle_li_CLICK() {
            var $this = $(this),
                num = $this.data('num');

            $listItems.removeClass('active');
            $this.addClass('active');
            currentNumber = num;
            instance.loadImg(currentNumber);
        }

        function init() {
            $canvas = $('#tree-canvas');
            ctx = $canvas[0].getContext('2d');
            $listItems = $('#tree-list li');
           
            $($listItems[currentNumber]).addClass('active');
            instance.loadImg(currentNumber);

            $listItems.click(handle_li_CLICK);
        }

        instance.loadImg = function (imgNumber) {

            if (!list[imgNumber]) {
                var img = new Image();
                img.addEventListener('load', handle_img_LOAD);
                img.src = "assets/images/tree_" + imgNumber + ".png";

                list[imgNumber] = img;
            } else {
                instance.draw();
            }

        };

        instance.draw = function () {
            ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
            ctx.drawImage(list[currentNumber], 10, 10);
        };

        init();
    };

	return CanvasTree;
});

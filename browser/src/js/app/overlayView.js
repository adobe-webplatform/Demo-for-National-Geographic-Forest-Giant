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

    var OverlayView;
    
    OverlayView = function () {

        var instance = this,
            //visible = false,
            $overlay;

        instance.visible = false;

        function resize() {
            var height = $('#main').height();
            $overlay.height(height);

            $('#overlay-balance').css({
                top: ($('.subhead').offset().top - 10) + 'px',
                left: $('.subhead').offset().left + $('.subhead').width() + 'px'
            });

            $('#overlay-drop').css({
                top: ($('#content .drop-caps').offset().top - $('#content .drop-caps').height() - 5) + 'px',
                left: $('#content .drop-caps').offset().left + 'px'
            });

            $('#overlay-flow').css({
                top: ($('#region2-1').offset().top + $('#region2-1').height() - 100) + 'px',
                left: $('#region2-1').offset().left + 'px'
            });

            $('#overlay-balance-2').css({
                top: $('blockquote').offset().top + 'px',
                left: ($('blockquote').offset().left + $('blockquote').width() - 200) + 'px'
            });

            $('#overlay-flow-2').css({
                top: ($('#region3').offset().top + $('#region3').height() - 350) + 'px',
                left: ($('#region3').offset().left + $('#region3').width() - 150) + 'px'
            });

            $('#overlay-shape-1').css({
                top: ($('#img2 .copy').offset().top - 70) + 'px',
                left: ($('#img2 .copy').offset().left - 50) + 'px'
            });

            $('#overlay-flow-stop-1').css({
                top: ($('#img2').offset().top - 140) + 'px',
                left: ($('#region5').offset().left + 150) + 'px'
            });

            $('#overlay-flow-start-1').css({
                top: ($('#img2').offset().top + $('#img2').height() + 30) + 'px',
                left: ($('#region6').offset().left + 200) + 'px'
            });

            $('#overlay-flow-stop-2').css({
                top: ($('#region6').offset().top + $('#region6').height() - 120) + 'px',
                left: ($('#region6').offset().left + 200) + 'px'
            });

            $('#overlay-flow-start-2').css({
                top: ($('#region7').offset().top - 20) + 'px',
                left: ($('#region7').offset().left + 200) + 'px'
            });

            $('#overlay-flow-stop-3').css({
                top: ($('#region7').offset().top + $('#region7').height() - 120) + 'px',
                left: ($('#region7').offset().left + 200) + 'px'
            });

            $('#overlay-flow-start-3').css({
                top: ($('#section9').offset().top - 20) + 'px',
                left: ($('#region9').offset().left + 200) + 'px'
            });

            $('#overlay-shape-2').css({
                top: ($('#img3 .copy').offset().top - 30) + 'px',
                left: ($('#img3 .copy').offset().left + $('#img3 .copy').width() - 300) + 'px'
            });

            $('#overlay-shape-3').css({
                top: ($('#map-california-figure').offset().top + 25) + 'px',
                left: ($('#map-california-figure').offset().left + 85) + 'px'
            });

            $('#overlay-filter-1').css({
                top: ($('#layers').offset().top + $('#layers').height() - 300) + 'px',
                left: ($('#layers').offset().left + $('#layers').width() - 300) + 'px'
            });

        }

        function init() {
            $overlay = $('#overlay');
        }

        instance.toggle = function () {

            instance.visible = !instance.visible;
            
            if (instance.visible === true) {
                resize();
                $overlay.show();
            } else {
                $overlay.hide();
            }

        };

        init();
    };

	return OverlayView;
});

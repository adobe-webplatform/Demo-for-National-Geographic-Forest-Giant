/*global define $ TweenMax Quad Quint TimelineMax d3 Quart*/
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

    var SectionMap;
    
    SectionMap = function () {

        var instance = this,
            Vars = require('app/vars'),
            UserEvent = require('app/events/UserEvent'),
            SectionMapElevation = require('app/sectionMapElevation'),
            SectionMapForest = require('app/sectionMapForest'),
            VERTEX_URL = "http://html.adobe.com/webstandards/csscustomfilters/cssfilterlab/shaders/vertex/page-curl.vs",
            FRAG_URL = "http://html.adobe.com/webstandards/csscustomfilters/cssfilterlab/shaders/fragment/page-curl.fs";

        function applyCurl(value) {
            $('#map')[0].style.webkitFilter = "custom(url(http://html.adobe.com/webstandards/csscustomfilters/cssfilterlab/shaders/vertex/page-curl.vs) mix(url(http://html.adobe.com/webstandards/csscustomfilters/cssfilterlab/shaders/fragment/page-curl.fs) normal source-atop), 50 50, transform perspective(1000) scale(1.0) rotateX(0deg) rotateY(0deg) rotateZ(0deg), curlPosition " + value.delta + " 0, curlDirection 104, curlRadius 0.2, bleedThrough 1.0)";
        }

        function handle_CLOSE() {
            $('.popup-close').unbind('click');
            $('.popup-hit-area').unbind('click');
            
            if( Vars.highPerformance ) {
                TweenMax.to($('.popup'), 0.2, {css: {opacity: '0'}, ease: Quart.easeOut, onComplete: function () {
                    TweenMax.set($('.popup'), {css: {display: 'none'}});
                }});
            } else {
                $('.popup').transitionedClose();
            }
        }

        function handle_map_CLICK(e) {
            var popup = $(this).data('popup'),
                newPos,
                value,
                $map = $('#map'),
                $treeClose = $('#tree .popup-close');

            e.preventDefault();

            switch (popup) {
            case "elevation":
                SectionMapElevation.show();
                break;
            case "forest":
                SectionMapForest.show();
                break;
            case "explore":
                //page curl

                $('#map a').hide();  //hide to prevent flickering

                value = {delta: 1};
                TweenMax.to(value, 2, {delta: -1, onUpdate: applyCurl, onUpdateParams: [value], onComplete: function () {
                    $map.css('visibility', 'hidden');
                }});

                //close curl
                $treeClose.click(function () {
                    $treeClose.unbind('click');


                    $map.css('visibility', 'visible');
                    
                    TweenMax.to(value, 2, {delta: 1, onUpdate: applyCurl, onUpdateParams: [value], onComplete: function () {
                        $map[0].style.webkitFilter = "none";
                        $map.find('.js-animates').addClass('in');
                        $('#map a').fadeIn(); //show again
                    }});
                    
                });
                break;
            }
        }

        function init() {
            $('.map-btn').click(handle_map_CLICK);
            UserEvent.POPUP_CLOSE.add(handle_CLOSE);
        }

        init();
    };

	return SectionMap;
});

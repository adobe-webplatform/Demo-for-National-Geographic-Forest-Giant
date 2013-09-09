/*global define $*/
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

    var UserEvent = require('app/events/UserEvent'),
        InView,
        instance,
        $container,
        $animates,
        TIMEOUT;

    function inviewAnimations() {
        $animates.each(function () {
            var $this = $(this);

            if ($this.offset().top - $(window).scrollTop() < $(window).height() - $this.height() / 2  && 
				$this.offset().top - $(window).scrollTop() + $this.height() > 0) 
            {
                if (!$this.hasClass('in')) {
                    $this.addClass('in');
                }
            } else {
                if ($this.hasClass('in')) {
                    $this.removeClass('in');
                }
            }
        });
    }

	function parallaxBg() {
		$('.js-bg').each(function () {
            var $this = $(this),
                yPos;

			yPos = Math.round((($this.offset().top - $('body').scrollTop()) / 8) - $this.data('offset'));
            $this.css('background-position', '50% ' + yPos + 'px');
        });
	}

    function parallaxAnimations() {
        $container.find('.js-parallax').each(function () {
            var $this = $(this);
            $this.css('background-position', '50% ' + $('body').scrollTop() / 2 + 'px');
        });
    }

    //TODO throttle?
    function handle_SCROLL() {

        //$container = $('body');
        
        TIMEOUT = setTimeout(function () {
            inviewAnimations();
            //parallaxAnimations();
            //parallaxBg();
        }, 100);
    }

    InView = function () {
        instance = this;

        instance.init = function () {
            UserEvent.SCROLL.add(handle_SCROLL);
        
            $container = $('body');
            $animates = $container.find('.js-animates');
        }
    };

    return new InView();
});

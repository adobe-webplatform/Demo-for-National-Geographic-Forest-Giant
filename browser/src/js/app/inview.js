/*global define $*/
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
						
            if ($this.offset().top - $('body').scrollTop() < $(window).height() - $this.height() / 2  && $this.offset().top - $('body').scrollTop() + $this.height() > 0) 
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

			//TODO:: check if in view
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

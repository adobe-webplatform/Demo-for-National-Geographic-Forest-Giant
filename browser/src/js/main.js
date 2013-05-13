/*global require $ TimelineMax TweenMax Quad Quint Quart Modernizr*/
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

require.config({
	shim: {

	},

	paths: {
        d3: 'vendor/d3.v2.min',
        jquery: 'vendor/jquery-1.9.0.min',
        balance: 'vendor/jquery.balancetext',
        hyphenator: 'vendor/hyphenate',
        lettering: 'vendor/jquery.lettering',
        signals: 'vendor/signals.min',
        tweenmax: 'vendor/greensock/TweenMax.min',
        threejs: 'vendor/three.min'
	}
});

require([
        'app/vars', 
        'app/assetLoader', 
        'app/headerBar', 
        'app/popupVideo',
        'app/canvasTree',
        'app/sectionMap',
        'app/sectionImageViewer',
        'app/sectionImageViewerWebgl',
        'app/overlayView',
        'app/events/UserEvent',
        'app/events/SiteEvent',
        'app/inview',
        'tweenmax', 
        'balance', 
        'hyphenator', 
        'lettering',
        'd3'
    ], function (
            Vars, 
            AssetLoader, 
            HeaderBar,
            PopupVideo,
            CanvasTree,
            SectionMap,
            SectionImageViewer,
            SectionImageViewerWebgl,
            OverlayView,
            UserEvent,
            SiteEvent,
            InView) {

        var $window,
            overlay,
            sectionImageViewer,
            popupVideo;

        function toggleOverlay() {
            overlay.toggle();

            if (overlay.visible) {
                $('#overlayToggle').html("X Hide Editor's Marks");    
            } else {
                $('#overlayToggle').html("&#10003; Show Editor's Marks");    
            }
        }
        
        function handle_RESIZE(e) {
            var _width = $window.width(),
                _halfwidth = $window.width() / 2;
			
			if (overlay.visible) {
		    	toggleOverlay();
			}
			
            $('.balance').balanceText();
            UserEvent.RESIZE.dispatch();
            $('.popup-box video').css({width: _width, height: _width, marginLeft: -_halfwidth, marginTop: -_halfwidth});
        }

        function handle_SCROLL(e) {

            //resolve cover
            if (!$('#cover').hasClass('resolve')) {
                $('#cover').addClass('resolve');
            }

            //fade to white at bottom
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                $('body').css({backgroundColor: 'white'});
            } else {
                $('body').css({backgroundColor: '#e6e6e6'});
            }

            UserEvent.SCROLL.dispatch();
        }

        function handle_KEY_DOWN(e) {
            if (e.keyCode == 192) {
                toggleOverlay();
            }
        }

        function handle_POPSTATE(e) {

            switch (location.hash) {
            case "#giantTree":
                if (sectionImageViewer.visible === false) {
                    sectionImageViewer.show();
                }
                break;
            case "#video":
                if (popupVideo.isOpen === false) {
                    popupVideo.open();
                }
				break;
            default:
                if (sectionImageViewer.visible === true) {
                    sectionImageViewer.destroy();
                }
                if (popupVideo.isOpen === true) {
                    popupVideo.close();
                }
                break;
            }
        }

        function minimumRequirements() {
            var meetsRequirements = true;

            /*
            if (!Modernizr.regions) {
                meetsRequirements = false;
                console.log('regions', meetsRequirements);
            }
            */

            if (!Modernizr.webgl) {
                meetsRequirements = false;
                console.log('webgl', meetsRequirements);
            }

            if (!Modernizr.shapes) {
                meetsRequirements = false;
                console.log('shapes', meetsRequirements);
            }

            if (!Modernizr.regionexclusion) {
                meetsRequirements = false;
                console.log('regionexclusion', meetsRequirements);
            }

            return meetsRequirements;
        }

        function init() {
            var css,
                canvasTree,
                sectionMap,
                headerBar;

            if (!minimumRequirements()) {
                $('#instructions').css('display', 'block');
                $('#preloader').hide();
                return;
            }

            Vars.highPerformance = !Modernizr.touch;
            $('html').addClass(Vars.highPerformance ? 'high-perf' : 'low-perf');
            
            $window = $(window);

            InView.init();
            AssetLoader.load();
            
            $('.lettering').lettering();
            $('.balance').balanceText();

            headerBar = new HeaderBar();
            popupVideo = new PopupVideo();
            canvasTree = new CanvasTree();
            sectionMap = new SectionMap();
            //sectionImageViewer = new SectionImageViewer();
            sectionImageViewer = new SectionImageViewerWebgl();
            overlay = new OverlayView();

            $window.resize(handle_RESIZE);
            $window.scroll(handle_SCROLL);
            $(document).bind('keydown', handle_KEY_DOWN);
            window.addEventListener("popstate", handle_POPSTATE);

            handle_RESIZE();

            SiteEvent.CSS_LOADED.add(function () {
                $('#preloader').fadeOut();
                $('.balance').balanceText();
            });

            SiteEvent.COVER_LOADED.add(function () {
            
            });

            $('#zoomViewBtn').click(function (e) {
                e.preventDefault();
                history.pushState('image viewer', 'image viewer', location.pathname + '#giantTree');
                sectionImageViewer.show();
            });

            $('#overlayToggle').click(function (e) {
                toggleOverlay();
            });


            //TESTING COVER INTERACTION
            $('#cover').bind('click', function () {
                var $this = $(this);
             
                if ($this.hasClass('resolve')) {
                    $this.removeClass('resolve');
                } else {
                    $this.addClass('resolve');
                }
                
            });


            //TESTING SCALING OF IMAGES FOR FULLSCREEN
            $('#img1').click(function () {
                var $img = $(this).clone(),
                    $this = $(this),
                    goalSize;

                $img.attr('id', 'img1clone');
                
                $this.css({visibility: 'hidden'});
                $img.css({zIndex: '100', position: 'fixed', top: $(this).offset().top - $window.scrollTop(), left: $(this).offset().left, margin: '0'});
                $('body').append($img);

                TweenMax.to($img, 0.4, {css: {top: '0', left: '0%', width: '100%', height: '100%'}, ease: Quint.easeOut});

                $img.click(function () {
                    $img.css({zIndex: '0'});
                    TweenMax.to($img, 0.4, {css: {top: $this.offset().top - $window.scrollTop(), left: $this.offset().left, width: $this.width(), height: $this.height()}, onComplete: function () {
                        $this.css({visibility: 'visible'});
                        $img.remove();
                    }});
                });
            });



            // jQuery extension for CSS-transitioned based popups
            $.fn.extend({
            	transitionedOpen: function(onOpened) {
            		var $this = this;
            		$this.addClass('opening');
					setTimeout( function() {
						$this.removeClass('opening').addClass('opened');
						if( onOpened ) {
							$this.unbind('transitionend')
								.on('transitionend', onOpened);
						}
					}, 1);
            	},
            	transitionedClose: function(onClosed) {
            		var $this = this;
                    $this.removeClass('opened').addClass('closing')
                    	.unbind('transitionend')
                    	.on('transitionend', function() {
                        	$this.removeClass('closing');
                        	if( onClosed ) {
                        		onClosed.call($this);
                        	}
                    });
            	}
            });
        }

        init(); //INITIALIZE
    });

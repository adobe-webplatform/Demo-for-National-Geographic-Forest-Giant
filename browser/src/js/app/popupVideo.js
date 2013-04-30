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

    var PopupVideo;
    

    PopupVideo = function () {
        var instance = this,
            canAutoPlay = true,
            videoReady = false,
            video,
            $video;

        function handle_close_COMPLETE() {
            var $popup = $('#popup-video');
            TweenMax.set($popup, {css: {display: 'none'}});
            $('#popup-video .popup-box').css('transform', '');
        }

        function handle_close_CLICK() {
            var timeline,
                videoBtn = $('#video-btn'),
                tween1,
                tween2,
                tween3,
                $box = $('#popup-video .popup-box');

            $('#popup-video .popup-close').unbind('click', handle_close_CLICK);

            video.pause();
            var currentTransform = $('#video-btn').css('transform');
            
            tween1 = TweenMax.to($box, 0.3, {css: {transform: currentTransform, left: videoBtn.offset().left, top: videoBtn.offset().top - $(window).scrollTop(), width: videoBtn.width(), height: videoBtn.height()}, ease: Quint.easeIn});
            tween2 = TweenMax.to($box, 0.4, {css: {opacity: 0}, ease: Quad.easeOut});

            timeline = new TimelineMax({onComplete: handle_close_COMPLETE});
            timeline.add(tween1);
            timeline.add(tween2);
            instance.isOpen = false;
            if( history.state != 'home' ) {
                history.pushState('home', 'home', location.pathname);
            }
        }

        function handle_open_COMPLETE() {
            var _width = $(window).width(),
                _halfwidth = $(window).width() / 2;

            $('#popup-video .popup-close').bind('click', handle_close_CLICK);
            $video.css({opacity: 1, width: _width, height: _width, marginLeft: - _halfwidth, marginTop: - _halfwidth});
            
            //$('.popup-box video')[0].seek(0);
            if( !videoReady ) {
                initVideo();
            }
            video.play();
        }

        function handle_open_CLICK() {
            var $this = $(this),
                $popup = $('#popup-video'),
                $box = $('#popup-video .popup-box'),
                timeline,
                tween1,
                tween2;
            
            $popup.css({'display': 'block', 'opacity': '1'});
            $box.css({
                top: $this.offset().top - $(window).scrollTop(),
                left: $this.offset().left,
                width: $this.width(),
                height: $this.height()
            });
            
            var currentTransform = $('#video-btn').css('transform');
            
            TweenMax.set($box, {transform: currentTransform, 'transformOrigin': 'top left'});
            tween1 = TweenMax.to($box, 0.4, {css: {opacity: 1}, ease: Quad.easeOut});
            tween2 = TweenMax.to($box, 0.3, {css: {transform: "none", left: '0%', top: '0%', width: '100%', height: '100%'}, ease: Quint.easeIn});

            timeline = new TimelineMax({onComplete: handle_open_COMPLETE});
            timeline.add(tween1);
            timeline.add(tween2);
            if( !canAutoPlay ) {
                // Call play() as result of timeout for Android
                setTimeout(function() {
                    video.play();
                }, 1000);
            }
            instance.isOpen = true;
            if( history.state != 'video' ) {
                history.pushState('video', 'video', location.pathname + '#video');
            }
        }
        
        function updatePlayPauseButton() {
            $('.playpause button').toggleClass('pause');
            //$('.player-play-icon').toggle( video.paused );
            //$('.player-pause-icon').toggle( !video.paused );
        }
        
        function updateMuteButton() {
            $('.togglemute button').toggleClass('mute');
            //$('.player-mute-icon').toggle( video.muted );
            //$('.player-unmute-icon').toggle( !video.muted );
        }
        
        function togglePause() {
            var wasPaused = video.paused;
            if( wasPaused ) {
                video.play();
            } else {
                video.pause();
            }
        }
        
        function toggleMute() {
            video.muted = !video.muted;
        }
        
        function initVideo() {
            var slider = $('#popup-video input')[0];
            var timeLabel = $('#popup-video .video-time')[0];
            var seekSliding = false;
            var newTime = -1;
            
            slider.max = video.duration;
            $(slider).on('mousedown', function() {
                seekSliding = true;
            }).on('mouseup', function() {
                seekSliding = false;
                if( newTime >= 0 ) {
                    video.currentTime = newTime;
                    newTime = -1;
                }
            }).on('change', function() {
                newTime = this.value;
            });
            
            $video.click(togglePause)
                .on('play pause', updatePlayPauseButton)
                .on('volumechange', updateMuteButton);
            
            var formatTime = function(seconds){
                var m = Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
                var s = Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
                return m+":"+s;
            };

            var seekUpdate = function() {
                var currentTime = video.currentTime;
                if(!seekSliding) {
                     slider.value = currentTime;
                }
                timeLabel.textContent = formatTime(currentTime);
            };
            
            $('#popup-video .playpause button').click(togglePause);
            $('#popup-video .togglemute button').click(toggleMute);
            
            $video.on('timeupdate', seekUpdate);
            videoReady = true;
        }

        function testAutoPlay() {
            // On Android the .play() call must be as result of click
            video.play();
            if(video.paused) {
                canAutoPlay = false;
            }
            video.pause();
        }
        
        function init() {
            $video = $('#popup-video video');
            video = $video[0];
            
            testAutoPlay();
        
            $('#video-btn').click(handle_open_CLICK);
        }
        
        instance.open = function() {
            handle_open_CLICK.apply($('#video-btn')[0]);
        };

        instance.close = function() {
            handle_close_CLICK();
        };

        init();
    };

	return PopupVideo;
});

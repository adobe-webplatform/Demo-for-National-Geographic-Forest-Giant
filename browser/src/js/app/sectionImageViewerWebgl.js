/*global define $ TweenMax Quad Quint TimelineMax d3 Quart TweenLite THREE requestAnimationFrame*/
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

    var SectionImageViewerWebgl,
        UserEvent = require('app/events/UserEvent');
    require('threejs');
    
    SectionImageViewerWebgl = function () {

        var instance = this,
            $body,
            $imageViewer,
            $canvas,
            $loader,
            $range,
            $zoomInBtn,
            $zoomOutBtn,
            camera,
            renderer,
            scene,
            container,
			dragging = false,
			scrolling = false,
			dragDelta = {x: 0, y: 0},
			oldPosition = {x: 0, y: 0},
			acceleration = {x: 0, y: 0},
			velocity = {x: 0, y: 0},
			position = {x: 0, y: 0, z: 0},
			friction = 0.97,
			bounce = 0.2,
            imageLoadCount = 0,
            IMAGE_COUNT = 126,
            IMAGE_ARRAY = [],
            ZOOM_MIN = 500,
            ZOOM_MAX = 400,
			RIGHT_BOUNDS = 83,
			LEFT_BOUNDS = 264,
			TOP_BOUNDS = -4200,
			BOTTOM_BOUNDS = -40;
            
        instance.visible = false;

        /**
        * close
        */
        function handle_closeBtn_CLICK(e) {
            history.pushState('home', 'home', location.pathname);
            instance.destroy();
        }

        function handle_RESIZE() {
	        renderer.setSize(window.innerWidth, window.innerHeight);
        }

        /**
		* tracking mouse
		* //TODO:: get speed and apply velocity
		*/
		function trackVelocity() {
			velocity.x = position.x - oldPosition.x;
			velocity.y = position.y - oldPosition.y;
			oldPosition.x = position.x;
			oldPosition.y = position.y;
		}
		
		function pointerStart(e) {
			dragDelta.x = e.x;
			dragDelta.y = e.y;
			oldPosition.x = position.x;
			oldPosition.y = position.y;
			dragging = true;
		}
		
		function pointerEnd(e) {
			dragging = false;
		}
		
		function pointerMove(e) {

			if (dragging) {
				oldPosition.x = position.x;
				oldPosition.y = position.y;

				//TRACKING MOUSE
				position.x -= (dragDelta.x - e.x);
				position.y += (dragDelta.y - e.y);

				dragDelta.x = e.x;
				dragDelta.y = e.y;
			}
		}

		function handle_MOUSEDOWN(e) {
			var pointer = {x: 0, y: 0};
			pointer.x = e.pageX;
			pointer.y = e.pageY;
			pointerStart(pointer);
		}
		
		function handle_MOUSEUP(e) {
			var pointer = {x: 0, y: 0};
			pointer.x = e.pageX;
			pointer.y = e.pageY;
			pointerEnd(pointer);
		}
		
		function handle_MOUSEMOVE(e) {
			var pointer = {x: 0, y: 0};
			pointer.x = e.pageX;
			pointer.y = e.pageY;
			pointerMove(pointer);
		}

		function handle_TOUCHSTART(e) {
			e.preventDefault();  //forces touch end to work correctly
			var pointer = {x: 0, y: 0};
			pointer.x = e.originalEvent.touches[0].pageX;
			pointer.y = e.originalEvent.touches[0].pageY;
			pointerStart(pointer);
		}

		function handle_TOUCHEND(e) {
			var pointer = {x: 0, y: 0};
			pointerEnd(pointer);
		}

		function handle_TOUCHMOVE(e) {
			e.preventDefault();  //forces touch end to work correctly
			var pointer = {x: 0, y: 0};
			pointer.x = e.originalEvent.touches[0].pageX;
			pointer.y = e.originalEvent.touches[0].pageY;
			pointerMove(pointer);
		}
		
		function handle_SCROLL(e) {
            e.preventDefault();
			var scrollDelta = {x: e.originalEvent.wheelDeltaX, y: e.originalEvent.wheelDeltaY};
			acceleration.y = scrollDelta.y / 100;
			acceleration.x = -scrollDelta.x / 100;
			scrolling = true;
		}

        function handle_zoomRange_CHANGE(e) {
            var zoomDifference = ZOOM_MIN - ZOOM_MAX;
            camera.position.z = ZOOM_MIN - (($range.val() / 100) * zoomDifference);
        }

        function handle_zoomInBtn_CLICK(e) {
            e.preventDefault();

            $range.val(100);
            camera.position.z = ZOOM_MAX;
        }

        function handle_zoomOutBtn_CLICK(e) {
            e.preventDefault();
            
            $range.val(0);
            camera.position.z = ZOOM_MIN;
        }

        function addEventListeners() {
            $(window).bind('resize', handle_RESIZE);
			$canvas.bind('mousedown', handle_MOUSEDOWN);
			$canvas.bind('mouseup', handle_MOUSEUP);
			$canvas.bind('mousemove', handle_MOUSEMOVE);
			$body.bind('mousewheel', handle_SCROLL);

			$canvas.bind('touchstart', handle_TOUCHSTART);
			$canvas.bind('touchend', handle_TOUCHEND);
			$canvas.bind('touchmove', handle_TOUCHMOVE);

            $range.bind('change', handle_zoomRange_CHANGE);
            $zoomInBtn.bind('click', handle_zoomInBtn_CLICK);
            $zoomOutBtn.bind('click', handle_zoomOutBtn_CLICK);
		}

        function removeEventListeners() {
            $(window).unbind('resize', handle_RESIZE);
			$canvas.unbind('mousedown');
			$canvas.unbind('mouseup');
			$canvas.unbind('mousemove');
			$body.unbind('mousewheel', handle_SCROLL);

			$canvas.unbind('touchstart');
			$canvas.unbind('touchend');
			$canvas.unbind('touchmove');

            $range.unbind('change', handle_zoomRange_CHANGE);
            $zoomInBtn.unbind('click', handle_zoomInBtn_CLICK);
            $zoomOutBtn.unbind('click', handle_zoomOutBtn_CLICK);
		}

        function manageBounds() {
			if (position.x < RIGHT_BOUNDS) {
				position.x = RIGHT_BOUNDS;
				velocity.x *= -bounce;
			} else if (position.x > LEFT_BOUNDS) {
				position.x = LEFT_BOUNDS;
				velocity.x *= -bounce;
			}

			if (position.y < TOP_BOUNDS) {
				position.y = TOP_BOUNDS;
				velocity.y *= -bounce;
			} else if (position.y > BOTTOM_BOUNDS) {
				position.y = BOTTOM_BOUNDS;
				velocity.y *= -bounce;
			}
		}

        /**
         * main logic loop
         *
         */
        function loop() {

			if (dragging) {
				trackVelocity();
			} else {
				velocity.x += acceleration.x;
				velocity.y += acceleration.y;
				velocity.x *= friction;
				velocity.y *= friction;
			}
			
			position.x += velocity.x;
			position.y += velocity.y;	
			manageBounds();

			container.position.x = position.x;
			container.position.y = position.y;	

            acceleration.x = 0;
            acceleration.y = 0;	
            scrolling = false;
		}
		
		function animate() {
            if (instance.visible) {
		        requestAnimationFrame(animate);
                loop();
                renderer.render(scene, camera);
            }
		}

        function runAnimation() {
            $loader.fadeOut();
            animate();
            TweenMax.to(camera.position, 20, {y: -2000, ease: Quad.easeOut, onComplete: addEventListeners});
            TweenMax.to(camera.rotation, 10, {x: 0, ease: Quad.easeIn});
            TweenMax.to(camera.position, 7, {z: ZOOM_MIN, delay: 5, ease: Quad.easeOut}); 
        }

        function addPhotos() {
			var pad = 50,
				_x_orig = 1957 / 2,
				_x = -_x_orig + pad,
				_y = 5148 / 2,
                i,
                geometry,
                material,
                mesh;
				
			for (i = 0; i < IMAGE_ARRAY.length; i += 1) {
				
                if (_x < _x_orig - 150) { //ignore edge photos

					geometry = new THREE.PlaneGeometry(IMAGE_ARRAY[i].t.image.naturalHeight, IMAGE_ARRAY[i].t.image.naturalWidth);
                    material = new THREE.MeshLambertMaterial({
                        color: 0xCC0000,
                        lights: true,
                        shadows: true,
                        overdraw: true,
                        map: THREE.ImageUtils.loadTexture(IMAGE_ARRAY[i].src)
                    });
                    
                    mesh = new THREE.Mesh(geometry, material);
					mesh.position.x = _x;
					mesh.position.y = _y;
					mesh.position.z = 100 + Math.random() * 500;
					mesh.castShadow = true;
					mesh.receiveShadow = true;
			        container.add(mesh);
			        TweenMax.to(mesh.position, 2, {z: 0, ease: Quad.easeInOut, delay: (i / 10)});
				}

				_x += IMAGE_ARRAY[i].t.image.naturalWidth;
					
				if (_x > _x_orig - 100) {
					_x = -_x_orig + pad;
					_y -= IMAGE_ARRAY[i].t.image.naturalHeight;
				}
			}

			setTimeout(runAnimation, 10);
		}

        function handle_texture_LOADED(e) {
			imageLoadCount += 1;
			if (IMAGE_COUNT == imageLoadCount) {
				addPhotos();
			}
        }

        function createScene() {
            var light,
                i,
                imgName,
                srcString,
                texture;

			camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
			camera.position.y = 2500;
	        camera.position.z = 1000;
	        camera.rotation.x = 0.8;

	        scene = new THREE.Scene();

			container = new THREE.Object3D();
	        scene.add(container);
			
	        light = new THREE.AmbientLight(0x333333); // soft white light
			scene.add(light);
			
            IMAGE_ARRAY = [];
            imageLoadCount = 0;

			for (i = 0; i < IMAGE_COUNT; i += 1) {
				imgName = i < 9 ? '0' + (i + 1) : i + 1;
				srcString = 'assets/images/xl/tiles_300/large_full_' + imgName + '.png';
				texture = THREE.ImageUtils.loadTexture(srcString, {}, handle_texture_LOADED);				
				IMAGE_ARRAY.push({t: texture, src: srcString});
			}

	        renderer = new THREE.CanvasRenderer();
			renderer.shadowMapEnabled = true;
			renderer.shadowMapType = THREE.PCFShadowMap;

	        renderer.setSize(window.innerWidth, window.innerHeight);

            if (imageLoadCount >= IMAGE_COUNT) {
                addPhotos();
            }

	        $imageViewer.prepend(renderer.domElement);
            $canvas = $('#imageViewer canvas');
        }

        instance.show = function () {
            $imageViewer.css('display', 'block');
            $loader.show();

            instance.visible = true;
            
            dragging = false;
			scrolling = false;
			dragDelta = {x: 0, y: 0};
			oldPosition = {x: 0, y: 0};
			acceleration = {x: 0, y: 0};
			velocity = {x: 0, y: 0};
			position = {x: 0, y: 0, z: 0};

			createScene();
        };

        instance.destroy = function () {
            instance.visible = false;
            $imageViewer.css('display', 'none');
	        $canvas.remove();
            removeEventListeners();
        };

        function init() {
            $body = $('body');
            $imageViewer = $('#imageViewer');
            $loader = $('#imageViewerLoader');
            $range = $('.zoomRange');
            $zoomInBtn = $('.zoomInBtn');
            $zoomOutBtn = $('.zoomOutBtn');
            $('#imageViewer .popup-close').bind('click', handle_closeBtn_CLICK);
        }

        init();
    };

	return SectionImageViewerWebgl;
});

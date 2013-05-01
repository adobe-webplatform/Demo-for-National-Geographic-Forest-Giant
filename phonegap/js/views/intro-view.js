/*global define $ TweenMax Quad Quint TimelineMax THREE*/
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

    var IntroView,
        AppEvent = require('events/app-event');

    require('three');
    
    IntroView = function () {
        var instance = this,
            $el = $('<canvas class="view intro-view">'),

            camera,
            scene,
            container,
            renderer,
            intro = true,
            animating = false,
            updateInterval,
            imageLoadCount = 0,
            timeline,
			dragging = false,
			scrolling = false,
			dragDelta = {x: 0, y: 0},
			oldPosition = {x: 0, y: 0},
			acceleration = {x: 0, y: 0},
			velocity = {x: 0, y: 0},
			position = {x: 0, y: 0, z: 0},
			friction = 0.97,
			bounce = 0.2,
            animationSpeed = 1.2,
            verticalPadding = 3000,
            TILE_COUNT = 126,
            IMAGE_COUNT = 3,
            IMAGE_ARRAY,
            TILES,
            ZOOM_MIN = 500,
            ZOOM_MAX = 400,
			RIGHT_BOUNDS = 83,
			LEFT_BOUNDS = 264,
			TOP_BOUNDS = -4200,
			BOTTOM_BOUNDS = -40;

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

            if (e.originalEvent.touches.length === 3) {
                AppEvent.GOTO_VIEW.dispatch(1);
            }
		}

        function addEventListeners() {
			$el.bind('touchstart', handle_TOUCHSTART);
			$el.bind('touchend', handle_TOUCHEND);
			$el.bind('touchmove', handle_TOUCHMOVE);
        }

        function removeEventListeners() {
            $el.unbind('touchstart', handle_TOUCHSTART);
			$el.unbind('touchend', handle_TOUCHEND);
			$el.unbind('touchmove', handle_TOUCHMOVE);
        }

        function handle_animation_COMPLETE() {
            if (intro) {
                AppEvent.GOTO_VIEW.dispatch(1);
                intro = false;
            }         
        }

        function runAnimation() {
            timeline.insert(TweenMax.to(camera.position, 17, {y: -2000 - verticalPadding, ease: Quad.easeOut}));
            timeline.insert(TweenMax.to(camera.rotation, 7, {x: 0, delay: 10, ease: Quad.easeInOut}));
            timeline.insert(TweenMax.to(camera.position, 7, {z: ZOOM_MIN, delay: 10, ease: Quad.easeInOut}));
            timeline.timeScale(animationSpeed);   
            TweenMax.ticker.addEventListener("tick", instance.draw);
            animating = true;

            var $splash = $('#splash');

            $splash.css({opacity: 0});
            
            setTimeout(function () {
                $splash.css({display: 'none'});
                timeline.play();
            }, 500);
        }

        function addPhotos() {
			var pad = 50,
				_x_orig = 1957 / 2,
				_x = -_x_orig + pad,
				_y = (5148 / 2) - verticalPadding,
                i,
                j = 0,
                col = 0,
                row = 0,
                page = 0,
                tex,
                texture,
                xOffset = 0,
                yOffset = 5,
                geometry,
                material,
                mesh,
                squares = 48,
                spriteSize = 300,
                imageWidth = 1957,
                imageHeight = 1800;
				
            timeline = new TimelineMax({onComplete: handle_animation_COMPLETE});
			timeline.pause();

            for (i = 0; i < TILE_COUNT; i += 1) {
				
                //add geometry, ignore edge photos 
                if (_x < _x_orig - 150) { 

					geometry = new THREE.PlaneGeometry(spriteSize, spriteSize);
                    geometry.faceVertexUvs[0][0] = [
                        new THREE.Vector2(xOffset, yOffset + 1),
                        new THREE.Vector2(xOffset, yOffset),
                        new THREE.Vector2(xOffset + 1, yOffset),
                        new THREE.Vector2(xOffset + 1, yOffset + 1)
                    ];

                    texture = IMAGE_ARRAY[j].t;
                    material = new THREE.MeshBasicMaterial({map: texture});

                    mesh = new THREE.Mesh(geometry, material);
					mesh.position.x = _x;
					mesh.position.y = _y;
					mesh.position.z = 100 + Math.random() * 500;
                    
                    TILES.push(mesh);
			        container.add(mesh);

                    timeline.insert(new TweenMax.to(mesh.position, 2, {z: 0, ease: Quad.easeInOut, delay: (verticalPadding / 1000) + (i / 10)}));
				}

                //manage rows
                xOffset += 1;
				_x += spriteSize;
				col += 1;

                //new row
                if (col > 6) {
                    xOffset = 0;
                    yOffset -= 1;
					_x = -_x_orig + pad;
					_y -= spriteSize;
                    col = 0;
                    row += 1;

                    //new photo
                    if (row % 6 === 0) {
                        j += 1;
                        xOffset = 0;
                        yOffset = 5;
                    }
                }
            }
            
            instance.draw();
            runAnimation();
        }

        function handle_texture_LOADED() {
			imageLoadCount += 1;
			if (IMAGE_COUNT == imageLoadCount) {
				addPhotos();
			}
        }

        function createScene() {

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
			camera.position.y = 2500;
	        camera.position.z = 1000;
	        camera.rotation.x = 0.8;

	        scene = new THREE.Scene();

			container = new THREE.Object3D();
	        scene.add(container);
			
            //renderer = new THREE.CanvasRenderer({canvas: $el[0]});
            renderer = new THREE.WebGLRenderer({canvas: $el[0]});
	        renderer.setSize(window.innerWidth, window.innerHeight);
            
            $el.css({
                webkitTransform: 'none', 
                opacity: '1', 
                width: '100%', 
                height: '100%'
            });
        }

        function loadImages() {
            var imgName,
                srcString,
                texture,
                material,
                image,
                i,
                geometry,
                mesh,
                spriteSize = 300,
                imageWidth = 1957,
                imageHeight = 1800;

            TILES = [];
            IMAGE_ARRAY = [];
            //imageLoadCount = 0;

			for (i = 1; i < IMAGE_COUNT + 1; i += 1) {
				srcString = 'assets/images/intro/lg/segment_' + i + '.jpg';
				texture = THREE.ImageUtils.loadTexture(srcString, {}, handle_texture_LOADED);
                texture.repeat.x = spriteSize / imageWidth;
                texture.repeat.y = spriteSize / imageHeight;

				IMAGE_ARRAY.push({t: texture, m: material, src: srcString, img: image});

                //add pre rendered textures for perf hit
                geometry = new THREE.PlaneGeometry(1, 1);
                material = new THREE.MeshBasicMaterial({map: texture});
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = 5148 / 2;
                scene.add(mesh);
            }

            if (imageLoadCount >= IMAGE_COUNT) {
                addPhotos();
            }
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

        function checkVisibility() {
            var i = 0,
                tile,
                padding = 1000;

            for (i; i < TILES.length; i += 1) {
                tile = TILES[i];

                if (tile.position.y > camera.position.y + padding ||
                    tile.position.y < camera.position.y - padding) {
                    tile.material.visible = false;
                } else {
                    tile.material.visible = true;
                }
            }
        }

        /*
        function updateAnimation() {
            if (camera.position.y > -2000) {
                camera.position.y -= 10;
            }

            if (camera.position.z > ZOOM_MIN) {
                camera.position.z -= 1;
            }

            if (camera.rotation.x > 0) {
                camera.rotation.x -= 0.01;
            }
        }
        */

        function updateInteractive() {
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

        function handle_CLICK(e) {
            if (intro) {
                timeline.kill();
                handle_animation_COMPLETE();
            }
        }

        instance.init = function () {
            createScene();
            loadImages();
        };

        instance.update = function () {
            updateInteractive();
        };

        instance.show = function () {
            if (!intro) {
                addEventListeners();
                updateInterval = setInterval(instance.update, 60 / 1000);
            }
        };

        instance.render = function () {
            $el.bind('click', handle_CLICK);
            return $el;
        };

        instance.draw = function () {
            renderer.render(scene, camera);
        };

        instance.animIn = function (callback) {

        };

        instance.animOut = function (callback) {
            animating = false;
            timeline.kill();
            removeEventListeners();
            TweenMax.ticker.removeEventListener("tick", instance.draw);
            clearInterval(updateInterval);
            
            var btn = $($('.toc-view-button')[0]);
            new TweenMax.to($el, 1, {
                css: {
                    scale: 0.5, 
                    x: btn.offset().left - (btn.width() * 0.6), 
                    y: btn.offset().top - (btn.height() * 0.6), 
                    z: 0.01,
                    opacity: 0
                }, 
                onComplete: function () {
                    callback(); 
                }
            });
        };

        instance.destroy = function () {
            renderer.clear();
            $el.unbind('click');
            $el.remove();
        };
    };

	return IntroView;
});

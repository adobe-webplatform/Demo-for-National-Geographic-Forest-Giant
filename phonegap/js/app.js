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

define(['views/main-view', 
        'controllers/controller'], 
        function (
            MainView, 
            Controller) {

    var App;
    
    App = function () {

        var instance = this;

        instance.init = function () {

            var _controller,
                _view;
            
            _view = new MainView();
            _controller = new Controller(_view);
        }
    };

	return new App();
});

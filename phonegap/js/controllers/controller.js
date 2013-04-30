/*global define $ TweenMax Quad Quint TimelineMax requestAnimationFrame*/
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

    var Controller,
        AppEvent = require('events/app-event');
    
    require('raf');
    
    Controller = function (view) {
        var instance = this,
            _view = view;

        function handle_GOTO_VIEW(v) {
            _view.gotoView(v);
        }

        function init() {
            _view.init();

            AppEvent.GOTO_VIEW.add(handle_GOTO_VIEW);
        }

        init();
    };

	return Controller;
});

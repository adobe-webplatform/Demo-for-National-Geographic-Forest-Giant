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

    var MainView,
        Model = require('models/model'),
        IntroView = require('views/intro-view'),
        ArticleContainerView = require('views/article-container-view'),
        PageContainerView = require('views/page-container-view'),
        TOCView = require('views/toc-view');
    
    MainView = function () {
        var instance = this,
            $el = $('#main'),
            currentView,
            VIEW_LIST = [
                new IntroView(),
                new TOCView(),
                new PageContainerView(Model.articles[0])
            ];

        
        instance.subviews = [];

        function handle_animIn_COMPLETE() {
            console.log('in');
        }

        function handle_animOut_COMPLETE() {
            instance.subviews[0].view.destroy();
            instance.subviews.splice(0, 1);
            instance.subviews[0].view.animIn(handle_animIn_COMPLETE);
        }

        instance.init = function () {
            currentView = 0;
            instance.gotoView(currentView);
        };

        instance.gotoView = function (newView) {

            var nextView;
 
            if (instance.subviews.length > 0) {
                
                nextView = VIEW_LIST[newView];
                nextView.init();
                $el.prepend(nextView.render());
                instance.subviews.push({view: nextView});
                nextView.show();
                instance.subviews[0].view.animOut(handle_animOut_COMPLETE);

            } else {
                //first time
                nextView = VIEW_LIST[newView];
                nextView.init();
                $el.prepend(nextView.render());
                nextView.show();
                nextView.animIn();
                instance.subviews.push({view: nextView});
            }

        };

    };

	return MainView;
});

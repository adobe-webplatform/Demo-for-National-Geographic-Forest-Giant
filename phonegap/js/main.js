/*global require FastClick*/
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

require(['app', 
    'fastclick', 
    'tweenmax', 
    'three',
    'raf',
    'hyphenate',
    'signals',
    'balance',
    'iscroll',
    'events/app-event',
    'events/user-event',
    'views/main-view',
    'views/intro-view',
    'views/page-thumb-scroll-view',
    'views/page-thumb',
    'views/toc-view',
    'views/toc-view-button',
    'views/page-container-view',
    'views/page-view',
    'views/article-container-view',
    'views/article-cover-view',
    'views/components/transform-element',
    'views/components/filter-element',
    'views/components/map-element',
    'text!views/pages/article1/cover.html',
    'text!views/pages/article1/page1.html',
    'text!views/pages/article1/page2.html',
    'text!views/pages/article1/page3.html',
    'text!views/pages/article1/page4.html',
    'text!views/pages/article1/page5.html',
    'text!views/pages/article1/page6.html',
    'text!views/pages/article1/page7.html',
    'text!views/pages/article1/page8.html',
    'text!views/pages/article1/page9.html',
    'text!views/pages/article1/page10.html',
    'text!views/pages/article1/page11.html',
    'text!views/pages/article1/page12.html',
    'text!views/pages/article1/content.html',
    'controllers/controller',
    'models/model'], function (App) {
	
    FastClick.attach(document.body);
    App.init();
});

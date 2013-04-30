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

    var Model,
        article1_cover = require('text!views/pages/article1/cover.html'),
        article1_p1 = require('text!views/pages/article1/page1.html'),
        article1_p2 = require('text!views/pages/article1/page2.html'),
        article1_p3 = require('text!views/pages/article1/page3.html'),
        article1_p4 = require('text!views/pages/article1/page4.html'),
        article1_p5 = require('text!views/pages/article1/page5.html'),
        article1_p6 = require('text!views/pages/article1/page6.html'),
        article1_p7 = require('text!views/pages/article1/page7.html'),
        article1_p8 = require('text!views/pages/article1/page8.html'),
        article1_p9 = require('text!views/pages/article1/page9.html'),
        article1_p10 = require('text!views/pages/article1/page10.html'),
        article1_p11 = require('text!views/pages/article1/page11.html'),
        article1_p12 = require('text!views/pages/article1/page12.html'),
        article1_content = require('text!views/pages/article1/content.html');
    
    Model = function () {
        var instance = this,
            article1 = {
                list: [
                    article1_cover,
                    article1_p1,
                    article1_p2,
                    article1_p3,
                    article1_p4,
                    article1_p5,
                    article1_p6,
                    article1_p7,
                    article1_p8,
                    article1_p9,
                    article1_p10, 
                    article1_p11,
                    article1_p12
                ],
                content: article1_content
            };

        instance.articles = [article1];
    };

	return new Model();
});

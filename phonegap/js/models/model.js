/*global define $ TweenMax Quad Quint TimelineMax*/
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

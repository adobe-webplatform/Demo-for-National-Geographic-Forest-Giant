/*global define $ TweenMax Quad Quint TimelineMax*/
define([], function (require) {

    var PageThumb;
    
    PageThumb = function (img) {
        var instance = this,
            $el = $('<div class="view page-thumb">');

        instance.init = function () {
            // $el.css({backgroundImage: 'url(' + img + ')'});
        };

        instance.setSize = function (w, h) {
            $el.css({width: w, height: h});
        };

        instance.setPosition = function (x, y) {
            TweenMax.set($el, {css: {x: x, y: y}});
        };

        instance.draw = function () {
            
        };

        instance.render = function () {
            return $el;
        };

        instance.animOut = function () {
            
        };

        instance.destroy = function () {
            $el.remove();
        };

        instance.init();
    };

	return PageThumb;
});

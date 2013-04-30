/*global define $ TweenMax Quad Quint TimelineMax iScroll*/
define([], function (require) {

    var PageView;

    PageView = function (content) {
        var instance = this,
            $el = $('<section class="view page-view">');

        instance.init = function () {
            $el.html(content);
        };

        instance.setPosition = function (x, y) {
            $el.css('left', x);
        };

        instance.show = function () {
            if ($el.find('.page-full').length > 0) {
                $el.addClass('page-view-full');
            }
            if ($el.find('.page-exact').length > 0) {
                $el.addClass('page-view-exact');
            }
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

	return PageView;
});


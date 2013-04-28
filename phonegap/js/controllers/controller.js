/*global define $ TweenMax Quad Quint TimelineMax requestAnimationFrame*/

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

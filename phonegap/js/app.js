/*global define $ TweenMax Quad Quint TimelineMax*/
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

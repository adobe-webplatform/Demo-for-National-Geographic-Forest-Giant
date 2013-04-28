/*global define $ TweenMax Quad Quint TimelineMax*/
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

        function handle_animOut_COMPLETE() {
            instance.subviews[0].view.destroy();
            instance.subviews.splice(0, 1);
        }

        instance.init = function () {
            currentView = 0;
            instance.gotoView(currentView);
        };

        instance.gotoView = function (newView) {

            var nextView;
 
            console.log('goto: ', newView);

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
                instance.subviews.push({view: nextView});
            }

        };

    };

	return MainView;
});

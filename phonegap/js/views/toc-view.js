/*global define $ TweenMax Quad Quint TimelineMax*/
define([], function (require) {

    var TOCView,
        TOCViewButton = require('views/toc-view-button');
    
    require('iscroll');

    TOCView = function () {
        var instance = this,
            $el = $('<div id="toc-view" class="view toc-view">'),
            $contents = $('<div class="view toc-contents">'),
            dir = './assets/images/toc/',
            padding = 10,
            tocScroll,
            lgWidth = (window.innerWidth / 2) - (padding * 2),
            colHeight = (window.innerHeight / 2) - (padding * 2),
            smWidth = colHeight * 2,
            buttons = [],
            contents = [
                {img: 'cover.jpg', content: '<img class="toc-logo" src="assets/images/toc/ng_logo.png">'},
                {img: 'article1.jpg', content: '<span class="toc-title">Forest Giant</span>'},
                {img: 'article3.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article4.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article2.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article5.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article6.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article7.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article3.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article4.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article2.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article5.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article6.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'},
                {img: 'article7.jpg', content: '<span class="toc-title coming-soon">Coming Soon</span>'}
            ];

        function populateButtons() {
            var i,
                x = padding,
                y = padding,
                max_width = padding,
                button,
                scale = 2.2,
                id;

            for (i = 0; i < contents.length; i += 1) {

                id = i > 0 ? i + 1: 0;

                button = new TOCViewButton(id, dir + contents[i].img);
                button.setSize(window.innerWidth / scale, window.innerHeight / scale);
                button.setPosition(x, y);
                button.render(); //.bind('click', handle_button_CLICK);
                buttons.push(button);

                if (i % Math.round(contents.length / 2) === 0 && i !== 0) {
                    max_width = x;
                    y += (window.innerHeight / scale) + padding;
                    x = padding;
                } else {
                    x += (window.innerWidth / scale) + padding;
                }

                button.render().html(contents[i].content);
                $contents.append(button.render());
            }
            
            $contents.css('width', max_width);
        }

        instance.init = function () {
            console.log('toc: init2');

            if (buttons.length === 0) {
                populateButtons();
            }

            for (var i = 0; i < buttons.length; i += 1) {
                buttons[i].show();
            }
        };

        instance.show = function () {
            tocScroll = new iScroll('toc-view', {
                momentum: true,
                bounce: false,
                hScrollbar: false,
                vScrollbar: false
            });

        };

        instance.render = function () {
            $el.append($contents);
            return $el;
        };

        instance.animOut = function (callback) {
            callback();
        };

        instance.destroy = function () {
            tocScroll.destroy();

            for (var i = 0; i < buttons.length; i += 1) {
                buttons[i].destroy();
            }

            $el.remove();
        };

    };

	return TOCView;
});

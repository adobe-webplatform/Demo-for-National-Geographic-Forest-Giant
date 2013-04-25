/*global define $ TweenMax Quad Quint TimelineMax*/
define([], function (require) {

    var CanvasTree;
    
    CanvasTree = function () {

        var instance = this,
            $listItems,
            $canvas,
            ctx,
            currentNumber = 0,
            list = [];

        function handle_img_LOAD() {
            instance.draw();
        }

        function handle_li_CLICK() {
            var $this = $(this),
                num = $this.data('num');

            $listItems.removeClass('active');
            $this.addClass('active');
            currentNumber = num;
            instance.loadImg(currentNumber);
        }

        function init() {
            $canvas = $('#tree-canvas');
            ctx = $canvas[0].getContext('2d');
            $listItems = $('#tree-list li');
           
            $($listItems[currentNumber]).addClass('active');
            instance.loadImg(currentNumber);

            $listItems.click(handle_li_CLICK);
        }

        instance.loadImg = function (imgNumber) {

            if (!list[imgNumber]) {
                var img = new Image();
                img.addEventListener('load', handle_img_LOAD);
                img.src = "assets/images/tree_" + imgNumber + ".png";

                list[imgNumber] = img;
            } else {
                instance.draw();
            }

        };

        instance.draw = function () {
            ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
            ctx.drawImage(list[currentNumber], 10, 10);
        };

        init();
    };

	return CanvasTree;
});

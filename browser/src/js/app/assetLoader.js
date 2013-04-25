/*global define $*/
define([], function (require) {

	var AssetLoader,
        assetList,
        SiteEvent = require('app/events/SiteEvent'),
        Vars = require('app/vars');

    assetList = [
		{id: 'img-cover', img: 'cover.jpg'},
		{id: 'img-video', img: 'video.jpg'},
		{id: 'img-mist', img: 'img1_mist.jpg'},
		{id: 'img-bottom', img: 'img2_bottom.jpg'},
		{id: 'img-dark', img: 'img3_dark.jpg'},
		{id: 'img-log', img: 'img4_log.jpg'},
		{id: 'img-map', img: 'map.jpg'}
	];
	
    AssetLoader = function () {
        var instance = this,
            IMG_URL = 'assets/images/';

        instance.cssLoaded = false;
        instance.imagesLoaded = false;
       
        function handle_img_LOAD(e) {

            //resolve cover
            if (instance.currentLoad == 1) {
                SiteEvent.COVER_LOADED.dispatch();
            }

            if (instance.currentLoad < assetList.length - 1) {
                $('.' + assetList[instance.currentLoad].id).removeClass('img');

                instance.currentLoad += 1;
                instance.loadNext();
            } else {
                SiteEvent.IMAGES_LOADED.dispatch();
                instance.imagesLoaded = true;
            }
        }

        this.loadNext = function () {
            var img = new Image(),
                fileArr,
                file,
                $img;

            if (Vars.retina) {
                fileArr = assetList[instance.currentLoad].img.split('.');
                file = fileArr[0] + '@2x.' + fileArr[1];
            } else {
                file = assetList[instance.currentLoad].img;
            }

            img.src = IMG_URL + file;
            img.addEventListener('load', handle_img_LOAD);

            //add img src
            $img = $('img.' + assetList[instance.currentLoad].id);
            if ($img.length > 0) {
                $img.attr('src', img.src);
            }
        };
    
        this.load = function () {

            var retina = window.devicePixelRatio > 1,
                css,
                checkInterval;

            if (retina) {
                Vars.retina = true;
                css = $('<link href="css/screen@2x.css" media="screen, projection" rel="stylesheet" type="text/css" />');
                $('head').append(css);
            } else {
                Vars.retina = false;
                css = $('<link href="css/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />');
                $('head').append(css);
            }

            instance.currentLoad = 0;
            instance.loadNext();

            function checkForCSSLoad() {
                if ($('#beacon')[0].clientWidth == 42) {
                    SiteEvent.CSS_LOADED.dispatch();
                    instance.cssLoaded = true;
                    clearInterval(checkInterval);
                }
            }

            checkInterval = setInterval(checkForCSSLoad, 10);

        };
    };

	return new AssetLoader();
});

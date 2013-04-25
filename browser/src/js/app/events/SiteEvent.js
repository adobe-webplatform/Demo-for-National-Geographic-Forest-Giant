define([], function(require) {
	
	var UserEvent = {
	    IMAGES_LOADED: new signals.Signal(),
	    CSS_LOADED: new signals.Signal(),
	    COVER_LOADED: new signals.Signal()
	}
	
	return UserEvent;
});

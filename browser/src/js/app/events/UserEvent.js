define([], function(require) {
	
	var UserEvent = {
		KEY_DOWN: new signals.Signal(),
		KEY_UP: new signals.Signal(),
		SCROLL: new signals.Signal(),
		RESIZE: new signals.Signal(),
		MOUSE_DOWN: new signals.Signal(),
		MOUSE_UP: new signals.Signal(),
		MOUSE_MOVE: new signals.Signal(),
		TOUCH_START: new signals.Signal(),
		TOUCH_END: new signals.Signal(),
		DEVICE_MOTION: new signals.Signal(),
		DEVICE_ORIENTATION: new signals.Signal(),
        POPUP_CLOSE: new signals.Signal()
	}
	
	return UserEvent;
});
